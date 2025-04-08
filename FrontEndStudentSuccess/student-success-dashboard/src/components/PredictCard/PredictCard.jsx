// src/components/PredictCard.jsx
import React, { useState } from 'react';
import { predictStudent } from '../../utils/api'; // Use the API helper
import './PredictCard.css';

const PredictCard = ({ setPredictionData }) => {
  const [manualData, setManualData] = useState({
    OnboardingTestScore: '',
    ClassesAttended: '',
    HomeworkSubmissionRate: '',
    HoursOnPlatform: '',
    ParticipationScore: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use the utility function to make the API call for prediction.
      const res = await predictStudent(manualData);
      // Update the parent's state with the prediction output.
      setPredictionData(res.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionData({ error: "Prediction failed. Please try again." });
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
    </section>
  );
};

export default PredictCard;
