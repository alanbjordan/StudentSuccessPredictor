import React, { useState } from 'react';
import { predictStudent } from '../../utils/api';
import './PredictCard.css';

const PredictCard = ({ setPredictionData }) => {
  const fieldRanges = {
    OnboardingTestScore: { min: 0, max: 100 },
    ClassesAttended: { min: 0, max: 18 },
    HomeworkSubmissionRate: { min: 0, max: 100 },
    HoursOnPlatform: { min: 0, max: 47 },
    ParticipationScore: { min: 0, max: 10 },
  };

  const [manualData, setManualData] = useState({
    OnboardingTestScore: '',
    ClassesAttended: '',
    HomeworkSubmissionRate: '',
    HoursOnPlatform: '',
    ParticipationScore: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.entries(manualData).every(([key, value]) => {
    if (value === '') return false;
    const numericValue = parseFloat(value);
    const { min, max } = fieldRanges[key];
    return !isNaN(numericValue) && numericValue >= min && numericValue <= max;
  });
  console.log("isFormValid:", isFormValid, "manualData:", manualData);

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      for (const [key, value] of Object.entries(manualData)) {
        const numValue = parseFloat(value);
        const { min, max } = fieldRanges[key];
        if (isNaN(numValue) || numValue < min || numValue > max) {
          throw new Error(`Invalid value for ${key}: ${value}. Must be between ${min} and ${max}.`);
        }
      }
      const predictionRes = await predictStudent(manualData);
      console.log("Prediction Data:", predictionRes.data);
      setPredictionData(predictionRes.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setError(error.message || "Prediction failed. Please try again.");
      setPredictionData({ error: "Prediction failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="predict-card">
      <header className="card-header">
        <h2>Student Behavioral Data</h2>
      </header>
      <p className="subtitle">Enter student data to predict performance.</p>
      <br />
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handlePredict} className="predict-form">
        {Object.entries(manualData).map(([key, value]) => {
          const { min, max } = fieldRanges[key] || { min: null, max: null };
          const numericValue = parseFloat(value);
          const isOutOfRange =
            value !== '' && (!isNaN(numericValue) && (numericValue < min || numericValue > max));

          return (
            <div className="input-group" key={key}>
              <input
                id={key}
                type="number"
                name={key}
                value={value}
                onChange={handleManualChange}
                placeholder={`${key.replace(/([A-Z])/g, ' $1').trim()}`}
                className={`input-field ${isOutOfRange ? 'warning' : ''}`}
                disabled={isLoading}
                required
              />
              <small className="range-info">
                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> Range {min} - {max}
              </small>
              {isOutOfRange && (
                <small className="error-message" style={{ color: 'red' }}>
                  Value must be between {min} and {max}.
                </small>
              )}
            </div>
          );
        })}
        {console.log("Button disabled:", !isFormValid || isLoading)}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </button>
      </form>
      <div className="learn-more-section" style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Want to learn more about how this prediction model works?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a
            href="https://github.com/alanbjordan/EdTechModel/blob/master/predict_student_success.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View Model Notebook
          </a>
          <a
            href="https://github.com/alanbjordan/StudentSuccessPredictor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View Deployment Code
          </a>
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <span className="loader">Processing...</span>
        </div>
      )}
    </section>
  );
};

export default PredictCard;