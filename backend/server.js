const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// IMPORTANT: Allow Cloudflare Pages frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://transportoperation.pages.dev',  // Your Cloudflare URL
    'https://*.pages.dev'  // Allow all Cloudflare Pages
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Car Rental API is running!',
    frontend: 'https://car-rental-frontend.pages.dev'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for Cloudflare Pages`);
});