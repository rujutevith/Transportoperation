const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all cars - with proper error handling
router.get('/', async (req, res) => {
  console.log('📦 GET /api/cars - Fetching all cars...');
  
  try {
    // First test the connection
    const [testResult] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection test passed');
    
    // Now fetch cars
    const [rows] = await db.query('SELECT * FROM cars ORDER BY created_at DESC');
    
    console.log(`✅ Found ${rows.length} cars`);
    
    // Always return an array, even if empty
    const carsArray = rows || [];
    
    res.json({
      success: true,
      count: carsArray.length,
      cars: carsArray
    });
  } catch (error) {
    console.error('❌ Error in /api/cars:', error.message);
    console.error('SQL Error:', error.sqlMessage);
    console.error('Stack:', error.stack);
    
    // Return empty array on error instead of crashing
    res.status(200).json({
      success: false,
      error: 'Database error',
      message: error.message,
      count: 0,
      cars: []
    });
  }
});

// GET single car
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📦 GET /api/cars/${id} - Fetching single car...`);
  
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [id]);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.json({
      success: true,
      car: rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching car:', error.message);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: error.message
    });
  }
});

module.exports = router;