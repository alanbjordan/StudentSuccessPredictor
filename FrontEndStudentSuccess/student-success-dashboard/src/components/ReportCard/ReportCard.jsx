// src/components/ReportCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ReportCard.css'; // Optional CSS for ReportCard styling

const ReportCard = () => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetReport = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/report');
      setReport(res.data.report);
    } catch (error) {
      console.error("Report error:", error);
      setReport("Failed to retrieve report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="report-card">
      <header className="card-header">
        <h2>Performance Report</h2>
        <p className="subtitle">Generate a summary of student performance.</p>
      </header>

      <button
        onClick={handleGetReport}
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Report"}
      </button>

      {isLoading && (
        <div className="loading-overlay">
          <span className="loader">Processing...</span>
        </div>
      )}

      {report && !isLoading && (
        <div className="response-box">
          <h3>Report</h3>
          <pre>{report}</pre>
        </div>
      )}
    </section>
  );
};

export default ReportCard;