const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Admin Platform Dashboard Metrics
router.get('/dashboard', verifyToken, verifyAdmin, (req, res) => {
  const totalUsers = store.users.length;
  const totalCars = store.cars.length;
  const totalRentals = store.rentals.length;
  const totalSales = store.salesOrders.length;

  const rentalRevenue = store.rentals
    .filter(r => r.status === 'approved' || r.status === 'completed')
    .reduce((sum, r) => sum + (r.total_price || 0), 0);

  const salesVolume = store.salesOrders
    .filter(s => s.status === 'sold' || s.status === 'deposit_paid')
    .reduce((sum, s) => sum + (s.sale_price || 0), 0);

  // Platform commissions (10% on rentals, 5% on completed sales)
  const platformCommissions = (rentalRevenue * 0.10) + (salesVolume * 0.05);

  const pendingModerations = store.cars.filter(c => !c.is_approved).length;
  const pendingRentals = store.rentals.filter(r => r.status === 'pending').length;
  const pendingVerifications = store.verifications.filter(v => v.status === 'pending').length;

  res.json({
    success: true,
    metrics: {
      totalUsers,
      totalCars,
      totalRentals,
      totalSales,
      rentalRevenue,
      salesVolume,
      platformCommissions: Math.round(platformCommissions),
      pendingModerations,
      pendingRentals,
      pendingVerifications,
      conversionRate: 14.8
    },
    recentUsers: store.users.slice(0, 5).map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, is_verified: u.is_verified })),
    recentRentals: store.rentals.slice(0, 5),
    recentSales: store.salesOrders.slice(0, 5)
  });
});

// Admin User Management: List all users
router.get('/users', verifyToken, verifyAdmin, (req, res) => {
  const { role, search } = req.query;
  let list = store.users;

  if (role && role !== 'all') {
    list = list.filter(u => u.role === role);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }

  const safeList = list.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    is_verified: u.is_verified,
    verification_status: u.verification_status,
    dealer_company_name: u.dealer_company_name,
    created_at: u.created_at || '2024-01-01'
  }));

  res.json({ success: true, count: safeList.length, users: safeList });
});

// Admin: Change user role / Ban
router.put('/users/:id/role', verifyToken, verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['customer', 'dealer', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }

  const user = store.users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  user.role = role;
  res.json({ success: true, message: `User role updated to ${role}`, user });
});

// Admin: Listing Moderation
router.get('/listings/moderation', verifyToken, verifyAdmin, (req, res) => {
  res.json({
    success: true,
    allListings: store.cars
  });
});

// Admin: Approve / Reject listing
router.put('/listings/:id/approve', verifyToken, verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { is_approved } = req.body;

  const car = store.cars.find(c => c.id === Number(id));
  if (!car) return res.status(404).json({ success: false, error: 'Car not found' });

  car.is_approved = !!is_approved;
  res.json({ success: true, message: `Car listing ${is_approved ? 'approved' : 'rejected'}` });
});

// Admin: Financials & Commissions overview
router.get('/financials', verifyToken, verifyAdmin, (req, res) => {
  const rentalGross = store.rentals
    .filter(r => r.status === 'approved' || r.status === 'completed')
    .reduce((sum, r) => sum + (r.total_price || 0), 0);

  const salesGross = store.salesOrders
    .filter(s => s.status === 'sold' || s.status === 'deposit_paid')
    .reduce((sum, s) => sum + (s.sale_price || 0), 0);

  const rentalCommission = rentalGross * 0.10;
  const salesCommission = salesGross * 0.05;
  const netEarnings = rentalCommission + salesCommission;

  res.json({
    success: true,
    summary: {
      rentalGross,
      salesGross,
      totalVolume: rentalGross + salesGross,
      rentalCommission: Math.round(rentalCommission),
      salesCommission: Math.round(salesCommission),
      netPlatformProfit: Math.round(netEarnings),
      payoutsPending: Math.round((rentalGross - rentalCommission) * 0.4)
    }
  });
});

module.exports = router;
