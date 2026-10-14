const express = require('express');
const router = express.Router();
const db = require('../config/db');
const store = require('../config/store');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// ==================== CUSTOMER RENTAL ROUTES ====================

// Get customer's own rentals
router.get('/my-rentals', verifyToken, async (req, res) => {
  try {
    let rentals = [];
    try {
      const [rows] = await db.query(`
        SELECT r.*, c.brand, c.model, c.image_url, c.daily_rental_rate, c.price as daily_rate
        FROM rentals r
        JOIN cars c ON r.car_id = c.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `, [req.user.id]);
      if (rows && rows.length > 0) {
        rentals = rows;
      }
    } catch (e) {
      // Store fallback
    }

    if (rentals.length === 0) {
      rentals = store.rentals
        .filter(r => r.user_id === req.user.id)
        .map(r => {
          const car = store.cars.find(c => c.id === r.car_id) || {};
          return {
            ...r,
            brand: car.brand || 'Vehicle',
            model: car.model || '',
            image_url: car.image_url,
            daily_rate: car.daily_rental_rate || car.price
          };
        });
    }

    res.json({ success: true, rentals });
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create rental with double-booking prevention & date checks
router.post('/rent', verifyToken, async (req, res) => {
  const {
    car_id,
    start_date,
    end_date,
    pickup_time = '10:00 AM',
    dropoff_time = '10:00 AM',
    pickup_location = 'Bugesera, Nyamata',
    dropoff_location = 'Bugesera, Nyamata',
    insurance_option = 'basic'
  } = req.body;
  const user_id = req.user.id;

  if (!car_id || !start_date || !end_date) {
    return res.status(400).json({ success: false, error: 'Vehicle, start date, and end date are required' });
  }

  const start = new Date(start_date);
  const end = new Date(end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (end < start) {
    return res.status(400).json({ success: false, error: 'Drop-off date cannot be before pick-up date' });
  }

  // Calculate rental days
  const diffTime = Math.abs(end - start);
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Find vehicle
  const car = store.cars.find(c => c.id === Number(car_id) || String(c.id) === String(car_id));
  if (!car) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }

  // Double booking validation
  const isConflict = store.rentals.some(r => {
    if (r.car_id === Number(car_id) && r.status !== 'cancelled') {
      const rStart = new Date(r.start_date);
      const rEnd = new Date(r.end_date);
      return (start <= rEnd && end >= rStart);
    }
    return false;
  });

  if (isConflict) {
    return res.status(400).json({
      success: false,
      error: 'This vehicle is already reserved for the selected dates. Please choose different dates or another vehicle.'
    });
  }

  // Insurance cost
  let insuranceCostPerDay = 0;
  if (insurance_option === 'premium') insuranceCostPerDay = 30;
  else if (insurance_option === 'full') insuranceCostPerDay = 50;
  else if (insurance_option === 'basic') insuranceCostPerDay = 15;

  const insuranceTotal = insuranceCostPerDay * days;
  const rate = car.daily_rental_rate || car.price || 100;
  const basePrice = rate * days;
  const securityDeposit = 250;
  const totalPrice = basePrice + insuranceTotal;

  const newRental = {
    id: Date.now(),
    user_id,
    car_id: Number(car_id),
    start_date,
    end_date,
    pickup_time,
    dropoff_time,
    pickup_location,
    dropoff_location,
    insurance_option,
    insurance_cost: insuranceTotal,
    security_deposit: securityDeposit,
    total_price: totalPrice,
    status: 'pending',
    payment_status: 'unpaid',
    created_at: new Date().toISOString()
  };

  try {
    const [result] = await db.query(
      `INSERT INTO rentals (user_id, car_id, start_date, end_date, total_price, status, pickup_location, dropoff_location)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [user_id, car_id, start_date, end_date, totalPrice, pickup_location, dropoff_location]
    );
    newRental.id = result.insertId;
  } catch (err) {
    console.warn('DB rental insert failed, using store:', err.message);
  }

  store.rentals.unshift(newRental);

  res.json({
    success: true,
    message: 'Booking request confirmed! Our concierge will review your schedule.',
    rental: newRental,
    days,
    total_price: totalPrice
  });
});

// Cancel a rental (customer)
router.put('/cancel/:id', verifyToken, async (req, res) => {
  const rentalId = Number(req.params.id);
  const userId = req.user.id;

  try {
    try {
      await db.query(
        'UPDATE rentals SET status = "cancelled" WHERE id = ? AND user_id = ?',
        [rentalId, userId]
      );
    } catch (e) {
      // Store fallback
    }

    const rental = store.rentals.find(r => r.id === rentalId && r.user_id === userId);
    if (rental) {
      rental.status = 'cancelled';
    }

    res.json({ success: true, message: 'Rental booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ==================== ADMIN RENTAL ROUTES ====================

// Get all rentals
router.get('/all-rentals', verifyToken, verifyAdmin, async (req, res) => {
  try {
    let rentals = [];
    try {
      const [rows] = await db.query(`
        SELECT r.*, c.brand, c.model, c.image_url, u.name as customer_name, u.email as customer_email
        FROM rentals r
        JOIN cars c ON r.car_id = c.id
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
      `);
      if (rows && rows.length > 0) rentals = rows;
    } catch (e) {
      // Store fallback
    }

    if (rentals.length === 0) {
      rentals = store.rentals.map(r => {
        const car = store.cars.find(c => c.id === r.car_id) || {};
        const customer = store.users.find(u => u.id === r.user_id) || {};
        return {
          ...r,
          brand: car.brand || 'Vehicle',
          model: car.model || '',
          image_url: car.image_url,
          customer_name: customer.name || 'Valued Client',
          customer_email: customer.email || 'customer@example.com'
        };
      });
    }

    res.json({ success: true, rentals });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rentals' });
  }
});

// Admin update rental status
router.put('/update-status/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  try {
    try {
      await db.query('UPDATE rentals SET status = ? WHERE id = ?', [status, id]);
    } catch (e) {}

    const rental = store.rentals.find(r => r.id === Number(id));
    if (rental) {
      rental.status = status;
    }

    res.json({ success: true, message: `Rental status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update rental status' });
  }
});

// Admin get customers with rental counts
router.get('/customers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const customers = store.users.map(u => {
      const userRentals = store.rentals.filter(r => r.user_id === u.id);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        is_verified: u.is_verified,
        rental_count: userRentals.length,
        created_at: u.created_at || '2024-01-01'
      };
    });

    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;