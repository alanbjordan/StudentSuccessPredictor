import React, { useState } from 'react';
import { predictStudent } from '../../utils/api'; // Use the API helper
import './PredictCard.css';

const PredictCard = ({ setPredictionData }) => {
  // Define the ranges for each field
  const fieldRanges = {
    OnboardingTestScore: { min: 0, max: 100 },
    ClassesAttended: { min: 0, max: 18 },
    HomeworkSubmissionRate: { min: 0, max: 100 },
    HoursOnPlatform: { min: 0, max: 40 },
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
        <h2>Student Behavioral Data</h2>
      </header>
      <p className="subtitle">Enter student data to predict performance.</p> <br></br>
      <form onSubmit={handlePredict} className="predict-form">
        {Object.entries(manualData).map(([key, value]) => {
          // determine field range details
          const { min, max } = fieldRanges[key] || { min: null, max: null };
          const numericValue = parseFloat(value);
          const isOutOfRange = !isNaN(numericValue) && (numericValue < min || numericValue > max);

          return (
            <div className="input-group" key={key}>

              <input
                id={key}
                type="number"
                name={key}
                value={value}
                onChange={handleManualChange}
                placeholder={`${key.replace(/([A-Z])/g, ' $1').trim()}`}
                className={`file-input ${isOutOfRange ? 'warning' : ''}`}
                required
                disabled={isLoading}
              />
              <small className="range-info">
                Allowed Range: {min} - {max}
              </small>
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Report"}
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
