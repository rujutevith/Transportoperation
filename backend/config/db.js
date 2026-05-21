const mysql = require('mysql2');
require('dotenv').config();

console.log('📡 Connecting to TiDB Cloud...');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   User: ${process.env.DB_USER}`);

const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  user: process.env.DB_USER || '3o18F1vsSMaVEgu.root',
  password: process.env.DB_PASSWORD || 'IvaOgnEBXvRCeA1x',
  database: process.env.DB_NAME || 'car_management',
  port: parseInt(process.env.DB_PORT) || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbConfig);
const db = pool.promise();

// Test connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ TiDB Cloud connected successfully');
    
    const [result] = await connection.query('SELECT DATABASE() as current_db');
    console.log(`📊 Database: ${result[0].current_db}`);
    
    // Check cars table
    const [tables] = await connection.query("SHOW TABLES LIKE 'cars'");
    if (tables.length > 0) {
      const [count] = await connection.query('SELECT COUNT(*) as count FROM cars');
      console.log(`🚗 Cars table found with ${count[0].count} records`);
    } else {
      console.warn('⚠️ Cars table not found. Please run the SQL schema.');
    }
    
    connection.release();
  } catch (err) {
    console.error('❌ TiDB Cloud connection failed:', err.message);
    console.error('   Please check your environment variables in Render');
  }
}

testConnection();

module.exports = db;