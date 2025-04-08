// src/components/ReportCard.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ReportCard = () => {
  const [report, setReport] = useState('');

  const handleGetReport = async () => {
    try {
      const res = await axios.get('http://localhost:5000/report');
      setReport(res.data.report);
    } catch (error) {
      console.error("Report error:", error);
      setReport("Failed to retrieve report");
    }
  };

  return (
    <section className="card">
      <h2>Performance Report</h2>
      <button onClick={handleGetReport} className="btn primary">Generate Report</button>
      {report && (
        <div className="response-box">
          <h3>Report</h3>
          <pre>{report}</pre>
        </div>
      )}
    </section>
  );
};

export default ReportCard;
