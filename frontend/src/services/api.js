import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("❌ Missing VITE_API_URL env variable!");
}

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
      const message = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection and backend server.'));
    } else {
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

export const salesAPI = {
  getSales: (params) => api.get('/api/sales', { params }),
  getFilters: () => api.get('/api/sales/filters')
};

export const authAPI = {
  signup: (payload) => api.post('/api/auth/signup', payload),
  login: (payload) => api.post('/api/auth/login', payload)
};

export default api;
