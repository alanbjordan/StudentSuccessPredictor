// App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [manualData, setManualData] = useState({
    OnboardingTestScore: '',
    ClassesAttended: '',
    HomeworkSubmissionRate: '',
    HoursOnPlatform: '',
    ParticipationScore: '',
  });
  const [predictResponse, setPredictResponse] = useState(null);
  const [report, setReport] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a CSV file.");
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResponse(res.data);
    } catch (error) {
      setUploadResponse({ error: "Upload failed" });
    }
  };

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
      setPredictResponse({ error: "Prediction failed" });
    }
  };

  const handleGetReport = async () => {
    try {
      const res = await axios.get('http://localhost:5000/report');
      setReport(res.data.report);
    } catch (error) {
      setReport("Failed to retrieve report");
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Success Predictor</h1>
        <p>Track and predict student performance easily</p>
      </header>

      <div className="dashboard-grid">
        {/* File Upload Card */}
        <section className="card">
          <h2>Upload Student Data</h2>
          <form onSubmit={handleFileUpload} className="upload-form">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              className="file-input"
            />
            <button type="submit" className="btn primary">Upload CSV</button>
          </form>
          {uploadResponse && (
            <div className="response-box">
              <h3>Result</h3>
              <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* Manual Entry Card */}
        <section className="card">
          <h2>Predict Individual Success</h2>
          <form onSubmit={handlePredict} className="manual-form">
            {Object.entries(manualData).map(([key, value]) => (
              <div className="input-group" key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
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

        {/* Report Card */}
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
      </div>
    </div>
  );
}

export default App;