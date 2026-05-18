import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Set up axios base URL - IMPORTANT for Render deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success(`Registration successful! Welcome ${user.name}!`);
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const response = await api.post('/api/auth/google', { token: credentialResponse.credential });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      toast.success(`Welcome, ${user.name}!`);
      return true;
    } catch (error) {
      console.error('Google login error:', error.response?.data);
      toast.error(error.response?.data?.error || 'Google login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
      return false;
    }
  };

  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', { token: resetToken, newPassword });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
      return false;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    googleLogin,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};