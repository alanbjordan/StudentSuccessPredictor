// src/components/Dashboard.jsx
import React, { useState } from 'react';
import PredictCard from './PredictCard/PredictCard';
import ReportCard from './ReportCard/ReportCard';
//import './Dashboard.css'; // Optional additional Dashboard styling

const Dashboard = () => {
  // Manage prediction data in a shared state.
  const [predictionData, setPredictionData] = useState(null);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Success Predictor</h1>
        <p>Track and predict student performance easily</p>
      </header>
      <div className="dashboard-grid">
        <PredictCard setPredictionData={setPredictionData} />
        <ReportCard predictionData={predictionData} />
      </div>
    </div>
  );
};

export default Dashboard;
