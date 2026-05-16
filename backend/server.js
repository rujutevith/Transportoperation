const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

// ==================== HEALTH CHECKS & ROOT ROUTES ====================

// Root route - API information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Car Rental API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        google: 'POST /api/auth/google',
        me: 'GET /api/auth/me',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password',
        logout: 'POST /api/auth/logout'
      },
      cars: {
        getAll: 'GET /api/cars',
        getOne: 'GET /api/cars/:id',
        create: 'POST /api/cars',
        update: 'PUT /api/cars/:id',
        delete: 'DELETE /api/cars/:id'
      }
    }
  });
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'car-rental-api'
  });
});

// Simple ping endpoint
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// ==================== API ROUTES ====================

// Auth routes
app.use('/api/auth', authRoutes);

// Car routes
app.use('/api/cars', carRoutes);

// ==================== 404 HANDLER ====================

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      'GET /': 'API Information',
      'GET /health': 'Health check',
      'GET /ping': 'Ping endpoint',
      'POST /api/auth/register': 'Register user',
      'POST /api/auth/login': 'Login user',
      'POST /api/auth/google': 'Google OAuth login',
      'GET /api/auth/me': 'Get current user',
      'GET /api/cars': 'Get all cars',
      'GET /api/cars/:id': 'Get single car'
    }
  });
});

// ==================== ERROR HANDLER ====================

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.stack : 'Something went wrong'
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;