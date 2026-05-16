import axios from 'axios';

// Use Render backend URL - UPDATE THIS WITH YOUR ACTUAL RENDER URL
const API_URL = import.meta.env.VITE_API_URL || 'https://transportoperation-1.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log API calls in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        toast.error('Session expired. Please login again.');
      } else if (status === 403) {
        toast.error('You don\'t have permission to perform this action');
      } else if (status === 404) {
        toast.error('Resource not found');
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(data?.message || data?.error || 'An error occurred');
      }
      
      console.error(`❌ API Error ${status}:`, data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ No response received:', error.request);
      toast.error('Cannot connect to server. Please check your internet connection.');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;