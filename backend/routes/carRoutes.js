const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all cars
router.get('/', async (req, res) => {
  console.log('📦 GET /api/cars');
  
  try {
    const [rows] = await db.query('SELECT * FROM cars ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: rows.length,
      cars: rows
    });
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Database error',
      message: error.message
    });
  }
});

// GET single car
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
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
    console.error('Error fetching car:', error);
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});

// POST create car
router.post('/', async (req, res) => {
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  if (!brand || !model || !year || !price) {
    return res.status(400).json({
      success: false,
      error: 'Brand, model, year, and price are required'
    });
  }
  
  try {
    const query = `INSERT INTO cars (brand, model, year, price, color, fuel_type, transmission, mileage, image_url) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const [result] = await db.query(query, [brand, model, year, price, color, fuel_type, transmission, mileage, image_url]);
    
    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      carId: result.insertId
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }
});

// PUT update car
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  try {
    const query = `UPDATE cars SET brand = ?, model = ?, year = ?, price = ?, color = ?, 
                   fuel_type = ?, transmission = ?, mileage = ?, image_url = ? WHERE id = ?`;
    
    const [result] = await db.query(query, [brand, model, year, price, color, fuel_type, transmission, mileage, image_url, id]);
    
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
      error: 'Database error'
    });
  }
});

// DELETE car
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
      error: 'Database error'
    });
  }
});

module.exports = router;