const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken, verifyAdmin, verifyDealerOrAdmin } = require('../middleware/auth');

// Calculate financing options
router.post('/calculate-financing', (req, res) => {
  const { salePrice, downPayment = 0, termMonths = 48, interestRate = 6.5 } = req.body;
  
  if (!salePrice || salePrice <= 0) {
    return res.status(400).json({ success: false, error: 'Valid sale price required' });
  }

  const principal = Math.max(0, Number(salePrice) - Number(downPayment));
  const monthlyRate = (interestRate / 100) / 12;
  const numberOfPayments = Number(termMonths) || 48;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  } else {
    monthlyPayment = principal / numberOfPayments;
  }

  const totalCost = (monthlyPayment * numberOfPayments) + Number(downPayment);
  const totalInterest = Math.max(0, totalCost - Number(salePrice));

  res.json({
    success: true,
    financing: {
      salePrice: Number(salePrice),
      downPayment: Number(downPayment),
      principal,
      termMonths: numberOfPayments,
      annualInterestRate: interestRate,
      estimatedMonthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalLoanAmount: Math.round(totalCost)
    }
  });
});

// Submit Sales Inquiry / Purchase Request
router.post('/inquiry', verifyToken, (req, res) => {
  const {
    car_id,
    financing_selected = false,
    down_payment = 0,
    monthly_term_months = 48,
    delivery_address = '',
    notes = ''
  } = req.body;

  if (!car_id) {
    return res.status(400).json({ success: false, error: 'Vehicle ID required' });
  }

  const car = store.cars.find(c => c.id === Number(car_id));
  if (!car) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }

  const newOrder = {
    id: Date.now(),
    car_id: Number(car_id),
    buyer_id: req.user.id,
    buyer_name: req.user.name,
    seller_id: car.owner_id || 1,
    sale_price: car.sale_price || (car.price * 150),
    financing_selected: !!financing_selected,
    down_payment: Number(down_payment || 0),
    monthly_term_months: Number(monthly_term_months || 48),
    status: 'inquiry',
    payment_status: 'unpaid',
    notes,
    delivery_address,
    created_at: new Date().toISOString()
  };

  store.salesOrders.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: 'Purchase inquiry submitted! Our vehicle sales specialist will contact you shortly.',
    order: newOrder
  });
});

// Schedule Test Drive
router.post('/test-drive', verifyToken, (req, res) => {
  const { car_id, scheduled_date, scheduled_time, notes } = req.body;

  if (!car_id || !scheduled_date || !scheduled_time) {
    return res.status(400).json({ success: false, error: 'Car ID, date, and preferred time are required' });
  }

  const car = store.cars.find(c => c.id === Number(car_id));
  if (!car) {
    return res.status(404).json({ success: false, error: 'Vehicle not found' });
  }

  const testDrive = {
    id: Date.now(),
    car_id: Number(car_id),
    user_id: req.user.id,
    user_name: req.user.name,
    scheduled_date,
    scheduled_time,
    notes: notes || 'Showroom test drive request',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  store.testDrives.unshift(testDrive);

  res.status(201).json({
    success: true,
    message: `Test drive confirmed for ${scheduled_date} at ${scheduled_time} at our Bugesera / Nyamata showroom!`,
    testDrive
  });
});

// Get My Purchases / Inquiries (Customer)
router.get('/my-purchases', verifyToken, (req, res) => {
  const orders = store.salesOrders
    .filter(o => o.buyer_id === req.user.id)
    .map(o => {
      const car = store.cars.find(c => c.id === o.car_id) || {};
      return {
        ...o,
        brand: car.brand || 'Vehicle',
        model: car.model || '',
        image_url: car.image_url,
        year: car.year
      };
    });

  const testDrives = store.testDrives
    .filter(t => t.user_id === req.user.id)
    .map(t => {
      const car = store.cars.find(c => c.id === t.car_id) || {};
      return {
        ...t,
        brand: car.brand,
        model: car.model,
        image_url: car.image_url
      };
    });

  res.json({
    success: true,
    purchases: orders,
    testDrives
  });
});

// Admin / Dealer: Get all sales orders
router.get('/all-orders', verifyToken, verifyDealerOrAdmin, (req, res) => {
  const orders = store.salesOrders.map(o => {
    const car = store.cars.find(c => c.id === o.car_id) || {};
    const buyer = store.users.find(u => u.id === o.buyer_id) || {};
    return {
      ...o,
      brand: car.brand,
      model: car.model,
      image_url: car.image_url,
      buyer_name: buyer.name || o.buyer_name || 'Client',
      buyer_email: buyer.email || 'client@example.com',
      buyer_phone: buyer.phone || 'N/A'
    };
  });

  res.json({ success: true, orders });
});

// Update order status (Admin / Dealer)
router.put('/order-status/:id', verifyToken, verifyDealerOrAdmin, (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  const order = store.salesOrders.find(o => o.id === Number(id));
  if (!order) {
    return res.status(404).json({ success: false, error: 'Sales order not found' });
  }

  if (status) order.status = status;
  if (payment_status) order.payment_status = payment_status;

  res.json({ success: true, message: `Sales order updated to ${order.status}`, order });
});

module.exports = router;
