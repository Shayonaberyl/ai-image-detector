import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) { setError("Please select an image first!"); return; }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setResult(response.data);
    } catch {
      setError("Cannot connect to server. Make sure Flask is running!");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0f;
          min-height: 100vh;
          color: white;
          overflow-x: hidden;
        }

        .bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(236,72,153,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 60%);
        }

        .orb1 {
          position: fixed;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%);
          border-radius: 50%;
          top: -100px; left: -100px;
          animation: float1 8s ease-in-out infinite;
          pointer-events: none;
        }

        .orb2 {
          position: fixed;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%);
          border-radius: 50%;
          bottom: -50px; right: -50px;
          animation: float2 10s ease-in-out infinite;
          pointer-events: none;
        }

        .orb3 {
          position: fixed;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%);
          border-radius: 50%;
          top: 50%; right: 20%;
          animation: float3 6s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 40px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, -30px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeDown 0.8s ease;
        }

        .badge {
          display: inline-block;
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.4);
          color: #a5b4fc;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
        }

        .title {
          font-size: 52px;
          font-weight: 800;
          line-height: 1.1;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
        }

        .subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.5);
          font-weight: 300;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 580px;
          backdrop-filter: blur(20px);
          animation: fadeUp 0.8s ease;
        }

        .dropzone {
          border: 2px dashed rgba(99,102,241,0.4);
          border-radius: 16px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(99,102,241,0.03);
          position: relative;
          overflow: hidden;
        }

        .dropzone:hover, .dropzone.active {
          border-color: rgba(99,102,241,0.8);
          background: rgba(99,102,241,0.08);
          transform: scale(1.01);
        }

        .dropzone-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .dropzone-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .dropzone-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
        }

        .preview-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          animation: fadeIn 0.5s ease;
        }

        .preview-img {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          border-radius: 16px;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
          border-radius: 16px;
        }

        .preview-filename {
          position: absolute;
          bottom: 12px;
          left: 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .change-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
        }

        .change-btn:hover { background: rgba(255,255,255,0.15); }

        .analyze-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          color: white;
          letter-spacing: 0.3px;
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(99,102,241,0.4);
        }

        .analyze-btn:active:not(:disabled) { transform: translateY(0); }

        .analyze-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 10px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .result-card {
          margin-top: 20px;
          border-radius: 20px;
          padding: 28px;
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .result-card.ai {
          background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(236,72,153,0.15));
          border: 1px solid rgba(239,68,68,0.3);
        }

        .result-card.real {
          background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15));
          border: 1px solid rgba(16,185,129,0.3);
        }

        .result-emoji {
          font-size: 48px;
          display: block;
          text-align: center;
          margin-bottom: 12px;
          animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }

        .result-title {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .result-title.ai { color: #f87171; }
        .result-title.real { color: #34d399; }

        .result-sub {
          text-align: center;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 24px;
        }

        .confidence-label {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .bar-bg {
          background: rgba(255,255,255,0.08);
          border-radius: 100px;
          height: 10px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 100px;
          animation: growBar 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both;
          transform-origin: left;
        }

        .bar-fill.ai {
          background: linear-gradient(90deg, #ef4444, #ec4899);
        }

        .bar-fill.real {
          background: linear-gradient(90deg, #10b981, #06b6d4);
        }

        @keyframes growBar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        .reset-btn {
          width: 100%;
          margin-top: 16px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .reset-btn:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 12px;
          padding: 14px 18px;
          color: #fca5a5;
          font-size: 14px;
          margin-top: 16px;
          animation: fadeIn 0.3s ease;
        }

        .stats-row {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .stat-box {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          color: rgba(255,255,255,0.2);
          font-size: 13px;
          animation: fadeIn 1s ease 0.5s both;
        }
      `}</style>

      <div className="bg" />
      <div className="orb1" />
      <div className="orb2" />
      <div className="orb3" />

      <div className="wrapper">
        <div className="header">
          <div className="badge">✨ Powered by CNN + MobileNetV2</div>
          <h1 className="title">AI vs Real<br />Image Detector</h1>
          <p className="subtitle">Upload any image and our AI will detect whether it was generated by AI or captured in real life</p>
        </div>

        <div className="card">
          {!preview ? (
            <div
              className={`dropzone ${dragOver ? "active" : ""}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <span className="dropzone-icon">🖼️</span>
              <p className="dropzone-title">Drop your image here</p>
              <p className="dropzone-sub">or click to browse — JPG, PNG, WEBP supported</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <>
              <div className="preview-container">
                <img src={preview} alt="preview" className="preview-img" />
                <div className="preview-overlay" />
                <span className="preview-filename">📎 {image?.name}</span>
                <button className="change-btn" onClick={reset}>✕ Remove</button>
              </div>

              <button
                className="analyze-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" />Analyzing image...</>
                ) : (
                  "🔍 Analyze Image"
                )}
              </button>
            </>
          )}

          {error && <div className="error-box">⚠️ {error}</div>}

          {result && (
            <>
              <div className={`result-card ${result.label === "AI Generated" ? "ai" : "real"}`}>
                <span className="result-emoji">
                  {result.label === "AI Generated" ? "🤖" : "📷"}
                </span>
                <p className={`result-title ${result.label === "AI Generated" ? "ai" : "real"}`}>
                  {result.label}
                </p>
                <p className="result-sub">
                  {result.label === "AI Generated"
                    ? "This image appears to be synthetically generated"
                    : "This image appears to be a real photograph"}
                </p>

                <div className="confidence-label">
                  <span>Confidence Score</span>
                  <span>{result.confidence}%</span>
                </div>
                <div className="bar-bg">
                  <div
                    className={`bar-fill ${result.label === "AI Generated" ? "ai" : "real"}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-value">{result.confidence}%</div>
                  <div className="stat-label">Confidence</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{result.label === "AI Generated" ? "🤖" : "📷"}</div>
                  <div className="stat-label">Detection</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">CNN</div>
                  <div className="stat-label">Model</div>
                </div>
              </div>

              <button className="reset-btn" onClick={reset}>
                ↩ Analyze another image
              </button>
            </>
          )}
        </div>

        <div className="footer">
          Built with React · Flask · TensorFlow · MobileNetV2
        </div>
      </div>
    </>
  );
}

export default App;



