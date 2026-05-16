const mysql = require('mysql2');
require('dotenv').config();

// Parse database URL if provided, otherwise use individual credentials
let dbConfig;

if (process.env.DATABASE_URL) {
  // Parse the DATABASE_URL
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading slash
    port: parseInt(url.port) || 4000,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  // Use individual environment variables
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'car_management',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

// Add SSL for production if needed
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
  dbConfig.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  };
}

// Create connection pool
const pool = mysql.createPool(dbConfig);
const db = pool.promise();

// Test connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL database connected successfully');
    console.log(`📊 Database: ${dbConfig.database}`);
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('📋 Connection config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
  }
}

testConnection();

module.exports = db;