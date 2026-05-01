from flask import Flask, request, jsonify
from flask_cors import CORS
from complaint_classifier import classify_complaint

app = Flask(__name__)
CORS(app)  # Enable CORS for communication with Node.js backend

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    description = data.get('description')
    
    if not description:
        return jsonify({"error": "Description is required"}), 400
    
    result = classify_complaint(description)
    return jsonify(result)

if __name__ == '__main__':
    print("Python ML Server running on port 8000...")
    app.run(port=8000)
