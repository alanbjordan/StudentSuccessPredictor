// src/App.jsx
import React from 'react';
import './App.css';
import UploadCard from './components/UploadCard/UploadCard';
import PredictCard from './components/PredictCard'; // Existing component
import ReportCard from './components/ReportCard';   // Existing component

function App() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Success Predictor</h1>
        <p>Track and predict student performance easily</p>
      </header>
      <div className="dashboard-grid">
        <UploadCard />
        <PredictCard />
        <ReportCard />
      </div>
    </div>
  );
}

export default App;
