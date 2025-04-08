// src/components/UploadCard/UploadCard.jsx
import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component
import './UploadCard.css'; // Optional CSS for UploadCard styling

// Import the helper function from your API utilities
import { uploadFile } from '../../utils/api';

const UploadCard = () => {
  const [file, setFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a CSV file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadFile(formData);
      setUploadResponse(res.data);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadResponse({ error: "Upload failed" });
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
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
        <div className="upload-result">
          <p>Upload complete!</p>
          <button onClick={openModal} className="btn secondary">
            View Data Summary
          </button>
        </div>
      )}
      {modalOpen && (
        <Modal onClose={closeModal}>
          <h3>Data Preview</h3>
          <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>
          {/* Optionally, add an additional "Process Data" button or other content */}
        </Modal>
      )}
    </section>
  );
};

export default UploadCard;
