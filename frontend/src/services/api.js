import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error. Please check if the backend server is running.'));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

export const salesAPI = {
  getSales: (params) => {
    return api.get('/sales', { params });
  },
  getFilters: () => {
    return api.get('/sales/filters');
  }
};

export default api;

