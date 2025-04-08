// src/components/PredictCard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PredictCard = () => {
  const [manualData, setManualData] = useState({
    OnboardingTestScore: '',
    ClassesAttended: '',
    HomeworkSubmissionRate: '',
    HoursOnPlatform: '',
    ParticipationScore: '',
  });
  const [predictResponse, setPredictResponse] = useState(null);

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/predict', manualData);
      setPredictResponse(res.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictResponse({ error: "Prediction failed" });
    }
  };

  return (
    <section className="card">
      <h2>Predict Individual Success</h2>
      <form onSubmit={handlePredict} className="manual-form">
        {Object.entries(manualData).map(([key, value]) => (
          <div className="input-group" key={key}>
            <label>{ key.replace(/([A-Z])/g, ' $1').trim() }</label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleManualChange}
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn primary">Predict</button>
      </form>
      {predictResponse && (
        <div className="response-box">
          <h3>Prediction</h3>
          <pre>{JSON.stringify(predictResponse, null, 2)}</pre>
        </div>
      )}
    </section>
  );
};

export default PredictCard;
