import ollama
import json
import re

def classify_complaint(description):
    """
    Classifies a complaint into High, Medium, or Low priority and provides a confidence score.
    Uses Qwen 2.5 7B via Ollama.
    """
    model_name = "qwen2.5:7b"
    
    # The default system prompt
    system_prompt = (
        "You are an expert customer support assistant specialized in complaint classification. "
        "Your task is to analyze the provided complaint description and determine its priority level: 'High', 'Medium', or 'Low'. "
        "High: Critical issues requiring immediate attention (e.g., safety, significant financial loss, service outage). "
        "Medium: Moderate issues affecting user experience but not critical (e.g., bugs, delays, partial service issues). "
        "Low: Minor issues or suggestions (e.g., UI tweaks, general feedback, non-urgent queries). "
        "\n\n"
        "You must output the result in EXACT JSON format with the following keys:\n"
        "1. 'priority': The determined priority (High, Medium, or Low).\n"
        "2. 'confidence': A numeric score between 0 and 1 indicating your confidence in this classification.\n"
        "\n"
        "Provide ONLY the JSON object. Do not include any other text or explanation."
    )

    try:
        # Call the Ollama API
        response = ollama.chat(
            model=model_name,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': f"Complaint Description: {description}"}
            ]
        )
        
        # Get the content from the response
        content = response['message']['content'].strip()
        
        # Try to find JSON in the response (in case the model adds extra text)
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            result = json.loads(json_str)
            # Ensure the key is 'confidence_score' for backend consistency or adjust backend
            if 'confidence' in result:
                result['confidence_score'] = result.pop('confidence')
            return result
        else:
            raise ValueError(f"No valid JSON found in response: {content}")
            
    except Exception as e:
        return {
            "error": str(e),
            "priority": "Unknown",
            "confidence_score": 0
        }

if __name__ == "__main__":
    # Example complaints to test
    test_complaints = [
        "My account has been hacked and all my money is gone! Please help immediately!",
        "The app takes 5 seconds to load the profile page. It's a bit slow.",
        "I think the blue color in the header is too dark. Maybe change it to a lighter shade?"
    ]
    
    print("--- Complaint Priority Classifier (Qwen 2.5 7B) ---\n")
    
    for complaint in test_complaints:
        print(f"Complaint: {complaint}")
        result = classify_complaint(complaint)
        print(f"Result: {json.dumps(result, indent=4)}\n")
