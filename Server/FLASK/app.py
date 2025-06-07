from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PIL import Image
import numpy as np
from keras.models import load_model
from resume_analyzer.analyzer import analyze_resume
from AnalyzeResume.resume_analyzer import analyze_resume1

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    result = analyze_resume(filepath)
    return jsonify(result)

@app.route('/analyze-resume', methods=['POST'])
def analyze_resume_route():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    result = analyze_resume1(filepath)
    return jsonify(result)


model = load_model("models/best_model.h5")
emotion_labels = ['anger', 'neutral', 'fear', 'sad', 'disgust', 'happy', 'surprise']

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = Image.open(request.files['image']).convert('L')
    image = image.resize((48, 48))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=-1)
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    emotion_idx = np.argmax(prediction)
    emotion = emotion_labels[emotion_idx]

    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
