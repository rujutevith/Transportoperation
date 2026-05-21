const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');  // ✅ Add database connection

dotenv.config();

const app = express();

// IMPORTANT: Allow Cloudflare Pages frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://transportoperation.pages.dev',
    'https://*.pages.dev',
    'https://transportoperation-1.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ==================== DATABASE DEBUG ENDPOINT ====================
app.get('/api/debug-db', async (req, res) => {
  try {
    // Test simple query
    const [result] = await db.query('SELECT 1 as test, DATABASE() as current_db, USER() as current_user');
    
    // Check if cars table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'cars'");
    
    // Get car count if table exists
    let carCount = 0;
    let sampleCars = [];
    if (tables.length > 0) {
      const [count] = await db.query('SELECT COUNT(*) as count FROM cars');
      carCount = count[0].count;
      
      if (carCount > 0) {
        const [cars] = await db.query('SELECT id, brand, model, year, price FROM cars LIMIT 3');
        sampleCars = cars;
      }
    }
    
    res.json({
      success: true,
      connection: 'OK',
      current_database: result[0].current_db,
      current_user: result[0].current_user,
      cars_table_exists: tables.length > 0,
      car_count: carCount,
      sample_cars: sampleCars,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  }
});

// ==================== API ROUTES ====================
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// ==================== ROOT ROUTE ====================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Car Rental API is running!',
    frontend: 'https://transportoperation.pages.dev',
    endpoints: {
      health: '/health',
      cars: '/api/cars',
      debug: '/api/debug-db',
      auth: '/api/auth'
    }
  });
});

// ==================== 404 HANDLER ====================
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for Cloudflare Pages`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Debug endpoint: http://localhost:${PORT}/api/debug-db`);
});