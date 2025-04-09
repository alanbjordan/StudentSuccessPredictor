// src/components/ReportCard/ReportCard.jsx
import React, { useState, useEffect } from 'react';
import { generateReport } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { marked } from 'marked';
import htmlToPdfmake from 'html-to-pdfmake';
import './ReportCard.css';

// Register fonts with pdfmake
try {
  pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts;
} catch (error) {
  console.error("Failed to initialize pdfmake VFS:", error);
}

const ReportCard = ({ predictionData }) => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!predictionData) return;
      setIsLoading(true);
      setError(null);

      try {
        const res = await generateReport(predictionData);
        console.log("Report Data:", res.data.report); // Debug
        if (!res.data.report || typeof res.data.report !== 'string') {
          throw new Error("Invalid report data received.");
        }
        setReport(res.data.report);
      } catch (error) {
        console.error("Report fetch error:", error);
        setError(error.message || "Failed to retrieve report. Please try again.");
        setReport('');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [predictionData]);

  const handleDownloadPDF = () => {
    if (!report) {
      console.error("No report data available for PDF generation.");
      setError("No report available to download.");
      return;
    }

    try {
      // 1. Convert Markdown --> HTML
      const html = marked(report);

      // 2. Convert HTML --> pdfmake-compatible structure
      const pdfContent = htmlToPdfmake(html);

      // 3. Build and download the PDF
      const docDefinition = {
        content: [
          { text: 'Student Performance Report', style: 'header' },
          {
            text: 'Generated on: ' + new Date().toLocaleDateString(),
            style: 'subheader',
            margin: [0, 0, 0, 20],
          },
          // The entire converted markdown as PDF content
          ...pdfContent,
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          subheader: { fontSize: 12, italics: true },
          // Additional custom styles if needed
        },
        pageMargins: [40, 60, 40, 60],
      };

      pdfMake.createPdf(docDefinition).download('student_report.pdf');
    } catch (error) {
      console.error("PDF generation error:", error);
      setError("Failed to generate PDF. Please try again.");
    }
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

      {error && <p className="error-message">{error}</p>}

      {report && !isLoading && (
        <>
          <div className="response-box">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
          <button className="btn btn-primary download-btn" onClick={handleDownloadPDF}>
            Download Report
          </button>
        </>
      )}
    </section>
  );
};

export default ReportCard;
