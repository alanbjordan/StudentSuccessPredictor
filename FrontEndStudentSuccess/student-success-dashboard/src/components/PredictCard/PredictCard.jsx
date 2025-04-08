// src/components/PredictCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './PredictCard.css'; // Optional CSS for PredictCard styling

const PredictCard = () => {
  const [manualData, setManualData] = useState({
    OnboardingTestScore: '',
    ClassesAttended: '',
    HomeworkSubmissionRate: '',
    HoursOnPlatform: '',
    ParticipationScore: '',
  });
  const [predictResponse, setPredictResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/predict', manualData);
      setPredictResponse(res.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictResponse({ error: "Prediction failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="predict-card">
      <header className="card-header">
        <h2>Predict Individual Success</h2>
        <p className="subtitle">Enter student data to predict performance.</p>
      </header>

      <form onSubmit={handlePredict} className="predict-form">
        {Object.entries(manualData).map(([key, value]) => (
          <div className="input-group" key={key}>
            <label htmlFor={key} className="file-label">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              id={key}
              type="number"
              name={key}
              value={value}
              onChange={handleManualChange}
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
              className="file-input"
              required
              disabled={isLoading}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {isLoading && (
        <div className="loading-overlay">
          <span className="loader">Processing...</span>
        </div>
      )}

      {predictResponse && !isLoading && (
        <div className="response-box">
          <h3>Prediction</h3>
          <pre>{JSON.stringify(predictResponse, null, 2)}</pre>
        </div>
      )}
    </section>
  );
};

export default PredictCard;