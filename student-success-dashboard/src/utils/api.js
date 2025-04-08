// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = (formData) => {
  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const predictStudent = (data) => {
  return apiClient.post('/predict', data);
};

export const getReport = () => {
  return apiClient.get('/report');
};

// New helper function to generate a report using POST
export const generateReport = (predictionData) => {
  return apiClient.post('/report', { predictionData });
};

export default apiClient;
