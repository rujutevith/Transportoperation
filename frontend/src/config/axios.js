import axios from 'axios';

// Smart API URL: In localhost development with Vite proxy, relative path works directly
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? '' : 'https://transportoperation.onrender.com');

console.log('🔗 API Base URL:', API_URL || '(Proxy /api)');

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with graceful error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.warn('Network alert: Remote backend is taking longer or unreachable.');
    }
    return Promise.reject(error);
  }
);

export default api;