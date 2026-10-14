const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken, verifyDealerOrAdmin } = require('../middleware/auth');

// Apply for dealer status
router.post('/apply', verifyToken, (req, res) => {
  const { company_name, description, phone, business_license } = req.body;

  const user = store.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  user.dealer_company_name = company_name || `${user.name} Auto`;
  user.dealer_description = description || 'Independent certified auto merchant';
  user.role = 'dealer'; // In marketplace, auto-upgrade or set pending
  if (phone) user.phone = phone;

  res.json({
    success: true,
    message: 'Dealer status activated! You can now list vehicles and manage rental calendars.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      dealer_company_name: user.dealer_company_name
    }
  });
});

// Dealer dashboard metrics & overview
router.get('/dashboard', verifyToken, verifyDealerOrAdmin, (req, res) => {
  const dealerId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // If admin, show all, otherwise dealer's own cars
  const myListings = isAdmin ? store.cars : store.cars.filter(c => c.owner_id === dealerId);
  const myCarIds = myListings.map(c => c.id);

  const myRentals = store.rentals.filter(r => myCarIds.includes(r.car_id));
  const mySales = store.salesOrders.filter(s => myCarIds.includes(s.car_id) || s.seller_id === dealerId);

  const totalEarnings = myRentals
    .filter(r => r.status === 'completed' || r.status === 'approved')
    .reduce((sum, r) => sum + (r.total_price || 0), 0) +
    mySales
    .filter(s => s.status === 'sold' || s.status === 'deposit_paid')
    .reduce((sum, s) => sum + (s.sale_price || 0), 0);

  const activeRentals = myRentals.filter(r => r.status === 'approved').length;
  const pendingRequests = myRentals.filter(r => r.status === 'pending').length +
    mySales.filter(s => s.status === 'inquiry').length;

  res.json({
    success: true,
    metrics: {
      activeListingsCount: myListings.length,
      totalEarnings,
      activeRentals,
      pendingRequests,
      rentalUtilizationRate: myListings.length > 0 ? Math.round((activeRentals / myListings.length) * 100) : 0
    },
    recentBookings: myRentals.slice(0, 5),
    recentInquiries: mySales.slice(0, 5),
    listings: myListings
  });
});

// Get dealer's own vehicle listings
router.get('/listings', verifyToken, verifyDealerOrAdmin, (req, res) => {
  const dealerId = req.user.id;
  const isAdmin = req.user.role === 'admin';
  const listings = isAdmin ? store.cars : store.cars.filter(c => c.owner_id === dealerId);

  res.json({ success: true, count: listings.length, listings });
});

// Rental Calendar Management: Get & toggle blocked dates for vehicle
router.get('/calendar/:carId', verifyToken, verifyDealerOrAdmin, (req, res) => {
  const carId = Number(req.params.carId);
  const bookings = store.rentals
    .filter(r => r.car_id === carId && r.status !== 'cancelled')
    .map(r => ({
      id: r.id,
      start_date: r.start_date,
      end_date: r.end_date,
      status: r.status,
      type: 'rental'
    }));

  const blocked = store.blockedDates
    .filter(b => b.car_id === carId)
    .map(b => ({
      date: b.date,
      reason: b.reason || 'maintenance',
      type: 'blocked'
    }));

  res.json({
    success: true,
    carId,
    bookedRanges: bookings,
    blockedDates: blocked
  });
});

// Block/Unblock date
router.post('/calendar/toggle-block', verifyToken, verifyDealerOrAdmin, (req, res) => {
  const { car_id, date, reason = 'Maintenance / Inspection' } = req.body;
  const carId = Number(car_id);

  const idx = store.blockedDates.findIndex(b => b.car_id === carId && b.date === date);
  if (idx !== -1) {
    store.blockedDates.splice(idx, 1);
    return res.json({ success: true, blocked: false, message: `Date ${date} unblocked` });
  } else {
    store.blockedDates.push({ car_id: carId, date, reason });
    return res.json({ success: true, blocked: true, message: `Date ${date} blocked for ${reason}` });
  }
});

module.exports = router;
