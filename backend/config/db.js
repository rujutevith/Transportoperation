const mysql = require('mysql2');
require('dotenv').config();

console.log('📡 Connecting to TiDB Cloud...');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   User: ${process.env.DB_USER}`);

const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  user: process.env.DB_USER || '3o18F1vsSMaVEgu.isingi_3FEm4eJL',
  password: process.env.DB_PASSWORD || 'IvaOgnEBXvRCeA1x',
  database: process.env.DB_NAME || 'car_management',
  port: parseInt(process.env.DB_PORT) || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false  // Set to false for testing
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000
};

const pool = mysql.createPool(dbConfig);
const db = pool.promise();

// Test connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ TiDB Cloud connected successfully');
    
    const [result] = await connection.query('SELECT DATABASE() as current_db, USER() as current_user');
    console.log(`📊 Database: ${result[0].current_db}`);
    console.log(`👤 User: ${result[0].current_user}`);
    
    connection.release();
  } catch (err) {
    console.error('❌ TiDB Cloud connection failed:', err.message);
    console.error('   Please check your environment variables in Render');
  }
}

testConnection();

module.exports = db;