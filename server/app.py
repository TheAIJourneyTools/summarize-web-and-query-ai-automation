from flask import Flask, request, jsonify
from ollama import chat
from ollama import ChatResponse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/query-generator', methods=['POST'])
def generate_query():
    data = request.data.decode('utf-8')

    # Use AI to create a query string from the data
    try:
        print("Asking for query search based on data received")
        prompt = f"Generate a search query based on the following information: {data}. Please be concise and clear and only return the query."
        response: ChatResponse = chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        print("AI response \n" + response.message.content)

        return jsonify({"processed_data": response.message.content}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Route to receive extracted data
@app.route('/process-data', methods=['POST'])
def process_data():
    # Get the extracted data from the request
    data = request.data.decode('utf-8')
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Process the data using Ollama
    try:
        print("Asking AI for summary of all data...", data)
        # Replace this with actual Ollama processing logic
        response: ChatResponse = chat(model='llama3.2', messages=[
            {
                'role': 'user',
                'content': 'Please summarize the data extracted of this two websites in one context: ' + data,
            },
        ])
        print("Summary AI response" + response.message.content)
        return jsonify({"processed_data": response.message.content}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)