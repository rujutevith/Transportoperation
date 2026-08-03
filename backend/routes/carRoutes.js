const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all cars - FIXED VERSION
router.get('/', async (req, res) => {
  console.log('📦 GET /api/cars - Fetching all cars...');
  
  try {
    // Use promise-based query with async/await
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
    
    // Return empty array on error
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: error.message,
      cars: []
    });
  }
});

// GET single car by ID
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

// CREATE new car (admin only)
router.post('/', async (req, res) => {
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  if (!brand || !model || !year || !price) {
    return res.status(400).json({ 
      success: false,
      error: 'Brand, model, year, and price are required' 
    });
  }
  
  try {
    const [result] = await db.query(
      'INSERT INTO cars (brand, model, year, price, color, fuel_type, transmission, mileage, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [brand, model, year, price, color, fuel_type, transmission, mileage, image_url]
    );
    
    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      carId: result.insertId
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ 
      success: false,
      error: 'Database error',
      message: error.message
    });
  }
});

// UPDATE car (admin only)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  try {
    const [result] = await db.query(
      'UPDATE cars SET brand=?, model=?, year=?, price=?, color=?, fuel_type=?, transmission=?, mileage=?, image_url=? WHERE id=?',
      [brand, model, year, price, color, fuel_type, transmission, mileage, image_url, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Car updated successfully'
    });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: error.message
    });
  }
});

// DELETE car (admin only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await db.query('DELETE FROM cars WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: error.message
    });
  }
});

module.exports = router;