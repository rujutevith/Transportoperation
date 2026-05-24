const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify user
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ==================== CUSTOMER ROUTES ====================

// Get customer's own rentals
router.get('/my-rentals', verifyToken, async (req, res) => {
  try {
    const [rentals] = await db.query(`
      SELECT r.*, c.brand, c.model, c.image_url, c.price as daily_rate
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [req.user.id]);
    
    res.json({ success: true, rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new rental (customer)
router.post('/rent', verifyToken, async (req, res) => {
  const { car_id, start_date, end_date, pickup_location, dropoff_location } = req.body;
  const user_id = req.user.id;
  
  if (!car_id || !start_date || !end_date) {
    return res.status(400).json({ error: 'Car ID, start date, and end date are required' });
  }
  
  try {
    // Get car price
    const [cars] = await db.query('SELECT price FROM cars WHERE id = ?', [car_id]);
    if (cars.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Calculate total price
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total_price = cars[0].price * days;
    
    // Create rental
    const [result] = await db.query(
      `INSERT INTO rentals (user_id, car_id, start_date, end_date, total_price, status, pickup_location, dropoff_location)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [user_id, car_id, start_date, end_date, total_price, pickup_location, dropoff_location]
    );
    
    res.json({ 
      success: true, 
      message: 'Rental request submitted successfully',
      rental_id: result.insertId,
      total_price,
      days
    });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel a rental (customer)
router.put('/cancel/:id', verifyToken, async (req, res) => {
  const rentalId = req.params.id;
  const userId = req.user.id;
  
  try {
    const [result] = await db.query(
      'UPDATE rentals SET status = "cancelled" WHERE id = ? AND user_id = ? AND status = "pending"',
      [rentalId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rental not found or cannot be cancelled' });
    }
    
    res.json({ success: true, message: 'Rental cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling rental:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all rentals (admin only)
router.get('/all-rentals', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rentals] = await db.query(`
      SELECT r.*, 
             u.name as user_name, u.email as user_email,
             c.brand, c.model, c.image_url
      FROM rentals r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      ORDER BY r.created_at DESC
    `);
    
    res.json({ success: true, rentals });
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all customers (admin only)
router.get('/customers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT id, name, email, role, created_at,
        (SELECT COUNT(*) FROM rentals WHERE user_id = users.id) as total_rentals
      FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC
    `);
    
    res.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get customer's rental history (admin)
router.get('/customer-rentals/:userId', verifyToken, verifyAdmin, async (req, res) => {
  const { userId } = req.params;
  
  try {
    const [rentals] = await db.query(`
      SELECT r.*, c.brand, c.model, c.image_url
      FROM rentals r
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    
    res.json({ success: true, rentals });
  } catch (error) {
    console.error('Error fetching customer rentals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update rental status (admin)
router.put('/update-status/:id', verifyToken, verifyAdmin, async (req, res) => {
  const rentalId = req.params.id;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'approved', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  try {
    const [result] = await db.query(
      'UPDATE rentals SET status = ? WHERE id = ?',
      [status, rentalId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Rental not found' });
    }
    
    res.json({ success: true, message: `Rental ${status} successfully` });
  } catch (error) {
    console.error('Error updating rental:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;