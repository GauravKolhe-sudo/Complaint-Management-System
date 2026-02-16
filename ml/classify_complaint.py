import requests
import json
import sys

# Configuration
OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "qwen2.5:3b-instruct"

# System Prompt Definition
SYSTEM_PROMPT = """
You are NOT a chatbot.
You are NOT an assistant.
You are a strict text classification model.

Your ONLY task is to analyze the complaint_text and return exactly ONE word from the following list:

High
Medium
Low

You must follow these rules strictly:
- Output ONLY one word.
- Do NOT explain.
- Do NOT generate code.
- Do NOT provide reasoning.
- Do NOT repeat the complaint.
- Do NOT add punctuation.
- Do NOT add extra words.
- Do NOT say anything before or after the answer.

Classification Rules:

High:
- Essential services affected (water, electricity, hospital access, sewage overflow)
- Public safety risk
- Health hazards
- Road completely blocked
- Fire, flooding, major damage
- Large number of people affected
- Emergency situations

Medium:
- Local inconvenience
- Parking issues
- Noise complaints
- Minor road damage
- Streetlight not working
- Garbage collection delay in small area
- Issues affecting limited number of people

Low:
- Personal disputes
- Very minor cleanliness issues
- Small inconvenience affecting very few people
- Non-urgent or informational complaints

Examples:

complaint_text = "no water supply today in my area"
Output: High

complaint_text = "unknown car parking in front of my home"
Output: Medium

complaint_text = "neighbor playing loud music during afternoon"
Output: Medium

complaint_text = "small crack in pavement near my gate"
Output: Low
"""

def classify_complaint(complaint_text):
    """
    Classifies the complaint text using the local Ollama model.
    """
    payload = {
        "model": MODEL_NAME,
        "messages": [
            { "role": "system", "content": SYSTEM_PROMPT },
            { "role": "user", "content": f'complaint = "{complaint_text}"\nClassify this.' }
        ],
        "stream": False,
        "options": {
            "temperature": 0.0  # Deterministic output
        }
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Check for /api/chat response format
        if "message" in result:
            priority = result["message"]["content"].strip()
        # Fallback for /api/generate format
        elif "response" in result:
            priority = result["response"].strip()
        else:
            priority = "Error: Unexpected response format"
            
        return priority
    except requests.exceptions.RequestException as e:
        return f"Error connecting to Ollama: {e}\nEnsure that 'ollama serve' is running."

def main():
    print(f"Complaint Priority Classifier (Model: {MODEL_NAME})")
    print("Connecting to local Ollama server...")
    print("-" * 50)

    while True:
        try:
            print("\nType 'exit' to quit.")
            user_input = input("Enter complaint text: ")
            
            if user_input.lower() in ['exit', 'quit']:
                break
            
            if not user_input.strip():
                continue
                
            print("Classifying...", end="\r")
            priority = classify_complaint(user_input)
            
            # Additional cleanup of output just in case model is chatty
            priority = priority.split('\n')[0].strip()
            # If not one of the allowed words, maybe model failed, inform user but show raw output
            if priority not in ["High", "Medium", "Low"] and "Error" not in priority:
                 print(f"Priority (Raw): {priority}")
            else:
                 print(f"Priority: {priority}")
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break

if __name__ == "__main__":
    main()
