// src/components/ReportCard.jsx
import React, { useState, useEffect } from 'react';
import { generateReport } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import './ReportCard.css';

const ReportCard = ({ predictionData }) => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!predictionData) return;
      setIsLoading(true);
      try {
        const res = await generateReport(predictionData);
        setReport(res.data.report);
      } catch (error) {
        console.error("Report error:", error);
        setReport("Failed to retrieve report. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [predictionData]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="report-card">
      <header className="card-header">
        <h2>Prediction Report</h2>
        <p className="subtitle">Summary of student prediction with actionable insights.</p>
      </header>

      {isLoading && (
        <div className="loading-overlay">
          <span className="loader">Processing...</span>
        </div>
      )}

      {report && !isLoading && (
        <div className="response-box">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      )}

      {/* Button to open the modal */}
      <button className="btn btn-primary download-btn" onClick={openModal}>
        Download Report
      </button> 

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Prediction Report</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handlePrint}>
                Print Report
              </button>
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReportCard;