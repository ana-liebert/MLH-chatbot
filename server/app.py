from flask import Flask, request, jsonify
from flask_cors import CORS
import string
import random
import openai
import os

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

greeting_inputs = ("hello", "hi", "hey", "what's up" "hi there", "heyy", "heyyy", "hii", "hi chitti", "hi!", "hey!", "hello!")
greeting_responses = ["Hello!", "Hi!", "Hey!", "Hi there!", "Welcome! Let's talk ramen.", "Hello there! Let's talk ramen.", "Hey babe", "Hey cutie", "Hey, what's up?", "Hey! What's poppin?"]


openai.api_key = os.environ["OPENAI_API_KEY"]
messages = [{"role" : "system", "content": "You are an assistant"}]

@app.route('/', methods=['GET'])
def hello():
    return 'Hello from Flask!'

@app.route('/post', methods=['POST'])
def receive_post():
    data = request.get_json()
    text = data.get('text', '')
    messages.append({"role": "user", "content" : text})
    for word in text.split():
        if word.lower() in greeting_inputs:
            return jsonify(random.choice(greeting_responses))
        if text.lower() == 'bye':
            return jsonify("Goodbye!")
            messages.clear()
        else:
            response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages = messages
        )
            ChatGPT_reply = response["choices"][0]["message"]["content"]
            messages.append({"role": "assistant", "content": ChatGPT_reply})
            return ChatGPT_reply
    

@app.route('/messages', methods=['GET'])
def get_history():
    return jsonify(messages)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000)