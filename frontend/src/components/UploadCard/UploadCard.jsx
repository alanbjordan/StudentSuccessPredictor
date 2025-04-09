// src/components/UploadCard/UploadCard.jsx
import React, { useState, useRef } from 'react';
import Modal from './Modal'; // Import the Modal component
import ReactMarkdown from 'react-markdown';
import './UploadCard.css'; // Optional CSS for UploadCard styling
import { uploadFile } from '../../utils/api';

const UploadCard = () => {
  const [file, setFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a ref to access the file input element directly
  const fileInputRef = useRef(null);

  // Handle file selection using the ref for clearing later if needed
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a CSV file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    try {
      const res = await uploadFile(formData);
      setUploadResponse(res.data);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResponse({ error: "Upload failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the entire upload card state and clear the file input field
  const handleReset = () => {
    setFile(null);
    setUploadResponse(null);
    // Clear the file input field using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <section className="upload-card card">
      {isLoading && (
        <div className="loading-overlay">
          <span className="loader">Processing...</span>
        </div>
      )}

      <header className="card-header">
        <h2>Upload Student Data</h2>
        <p className="subtitle">Upload a CSV file to analyze student information.</p>
      </header>

      <form onSubmit={handleFileUpload} className="upload-form">
        <div className="input-group">
          <label htmlFor="file-upload" className="file-label">
            Select CSV File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input"
            disabled={isLoading}
            ref={fileInputRef}  // Associate the input with the ref
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !file}
        >
          {isLoading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {uploadResponse && !isLoading && (
        <div className="upload-result">
          <p className="success-message">
            {uploadResponse.error ? uploadResponse.error : "Upload successful!"}
          </p>
          {!uploadResponse.error && (
            <div className="action-buttons">
              <button onClick={openModal} className="btn btn-secondary">
                View Data Summary
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <Modal onClose={closeModal}>
          <h3>Data Preview</h3>
          {uploadResponse && uploadResponse.refined_summary ? (
            <ReactMarkdown>{uploadResponse.refined_summary}</ReactMarkdown>
          ) : (
            <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>
          )}
        </Modal>
      )}
    </section>
  );
};

export default UploadCard;
