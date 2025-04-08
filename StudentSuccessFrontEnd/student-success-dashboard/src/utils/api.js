// src/utils/api.js
import axios from 'axios';

// Define the base URL for your API endpoints.
// You can also set this via an environment variable (e.g., REACT_APP_API_URL)
// which is useful when you deploy your application.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to upload a CSV file
export const uploadFile = (formData) => {
  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Helper function to send manual data for prediction
export const predictStudent = (data) => {
  return apiClient.post('/predict', data);
};

// Helper function to retrieve a performance report
export const getReport = () => {
  return apiClient.get('/report');
};

// Optionally export the apiClient instance in case you need to use it directly
export default apiClient;
