const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ==================== GET ALL CARS ====================

router.get('/', (req, res) => {
  const query = 'SELECT * FROM cars ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: err.message 
      });
    }
    
    res.json({ 
      success: true,
      count: results.length,
      cars: results 
    });
  });
});

// ==================== GET SINGLE CAR ====================

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM cars WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Car not found' 
      });
    }
    
    res.json({ 
      success: true,
      car: results[0] 
    });
  });
});

// ==================== CREATE CAR (Admin only) ====================

router.post('/', (req, res) => {
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  // Validate required fields
  if (!brand || !model || !year || !price) {
    return res.status(400).json({ 
      success: false,
      error: 'Brand, model, year, and price are required' 
    });
  }
  
  const query = `INSERT INTO cars (brand, model, year, price, color, fuel_type, transmission, mileage, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [brand, model, year, price, color, fuel_type, transmission, mileage, image_url], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error' 
      });
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Car created successfully',
      carId: result.insertId 
    });
  });
});

// ==================== UPDATE CAR (Admin only) ====================

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { brand, model, year, price, color, fuel_type, transmission, mileage, image_url } = req.body;
  
  const query = `UPDATE cars SET brand = ?, model = ?, year = ?, price = ?, color = ?, 
                 fuel_type = ?, transmission = ?, mileage = ?, image_url = ? WHERE id = ?`;
  
  db.query(query, [brand, model, year, price, color, fuel_type, transmission, mileage, image_url, id], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error' 
      });
    }
    
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
  });
});

// ==================== DELETE CAR (Admin only) ====================

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cars WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error' 
      });
    }
    
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
  });
});

module.exports = router;