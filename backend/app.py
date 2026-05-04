from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import os

# Create Flask app
app = Flask(__name__)
CORS(app)  # This allows React to talk to Flask

# Load the trained model when server starts
print("Loading AI model...")
model = load_model('model/detector.h5')
print("Model loaded successfully!")

def prepare_image(image_bytes):
    # Open the image
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB (in case image is PNG with transparency)
    img = img.convert('RGB')
    
    # Resize to 64x64 (same size we trained with)
    img = img.resize((64, 64))
    
    # Convert to numbers
    img_array = np.array(img)
    
    # Normalize pixels from 0-255 to 0-1
    img_array = img_array / 255.0
    
    # Add extra dimension (model expects batch of images)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "AI Image Detector API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    # Check if image was sent
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400
    
    try:
        # Read and prepare the image
        image_bytes = file.read()
        img_array = prepare_image(image_bytes)
        
        # Make prediction
        prediction = model.predict(img_array)
        confidence = float(prediction[0][0])
        
        # confidence close to 1 = FAKE
        # confidence close to 0 = REAL
        if confidence > 0.5:
            label = "AI Generated"
            score = round(confidence * 100, 2)
        else:
            label = "Real"
            score = round((1 - confidence) * 100, 2)
        
        return jsonify({
            "label": label,
            "confidence": score
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)