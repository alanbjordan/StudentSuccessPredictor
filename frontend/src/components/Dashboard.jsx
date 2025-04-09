// src/components/Dashboard.jsx
import React, { useState } from 'react';
import PredictCard from './PredictCard/PredictCard';
import ReportCard from './ReportCard/ReportCard';
import './Dashboard.css'; 

const Dashboard = () => {
  // Manage prediction data in a shared state.
  const [predictionData, setPredictionData] = useState(null);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Performance Navigator</h1>
      </header>
      <div className="dashboard-grid">
        <PredictCard setPredictionData={setPredictionData} />
        <ReportCard predictionData={predictionData} />
      </div>
    </div>
  );
};

export default Dashboard;
