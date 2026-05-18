import axios from 'axios';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'https://transportoperation.onrender.com';

console.log('🔗 API URL:', API_URL);  // Debug log

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,  // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false  // Set to false for CORS issues
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response:`, response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network error - Cannot reach backend');
      console.error('   Backend URL:', API_URL);
    } else if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;