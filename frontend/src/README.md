# 🔍 AI vs Real Image Detector

A full-stack web application that detects whether an image is **AI Generated** or **Real** using a CNN-based deep learning model.

## 🚀 Live Demo
- Frontend: (add your Vercel link here)
- Backend: (add your Render link here)

## 🛠️ Technologies Used
- **Frontend:** React.js, Axios, CSS Animations
- **Backend:** Flask, Python, REST API
- **AI Model:** TensorFlow, Keras, MobileNetV2
- **Image Processing:** OpenCV, Pillow
- **Deployment:** Vercel (frontend), Render (backend)

## 🧠 How It Works
1. User uploads an image
2. React sends it to Flask API via POST request
3. Flask preprocesses the image using OpenCV
4. CNN model predicts if image is AI or Real
5. Confidence score is returned and displayed

## 📊 Model Performance
- Training Accuracy: 87.98%
- Validation Accuracy: 85.99%
- Dataset: 120,000 images (CIFAKE dataset)

## ⚙️ Run Locally

### Backend
cd backend
pip install -r requirements.txt
python app.py

### Frontend
cd frontend
npm install
npm start

## 👩‍💻 Author
Shayona Beryl
