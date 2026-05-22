import axios from 'axios';

// Use the Render backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://transportoperation.onrender.com';

console.log('🔗 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response: ${response.status} ${response.config.url}`);
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