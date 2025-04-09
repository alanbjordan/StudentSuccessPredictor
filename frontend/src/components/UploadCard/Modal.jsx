// src/components/UploadCard/Modal.jsx
import React from 'react';
import './Modal.css'; // Import CSS for modal styling if you have one

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="btn primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
