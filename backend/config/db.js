const mysql = require('mysql2');
require('dotenv').config();

// Determine if running in production
const isProduction = process.env.NODE_ENV === 'production';

// Database configuration
const dbConfig = isProduction ? {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'car_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);
const db = pool.promise();

// Test connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL database connected successfully');
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`🌍 Environment: ${isProduction ? 'Production' : 'Development'}`);
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    if (!isProduction) {
      console.warn('⚠️ Make sure MySQL is running and credentials are correct');
    }
  }
}

testConnection();

module.exports = db;