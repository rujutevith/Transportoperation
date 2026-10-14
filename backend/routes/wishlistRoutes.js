const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken } = require('../middleware/auth');

// Get user's wishlist
router.get('/', verifyToken, (req, res) => {
  const userWishlist = store.wishlists.filter(w => w.user_id === req.user.id);
  const carIds = userWishlist.map(w => w.car_id);
  const cars = store.cars.filter(c => carIds.includes(c.id));

  res.json({
    success: true,
    wishlist: cars,
    carIds
  });
});

// Toggle wishlist item
router.post('/toggle/:carId', verifyToken, (req, res) => {
  const carId = Number(req.params.carId);
  const userId = req.user.id;

  const existingIndex = store.wishlists.findIndex(w => w.user_id === userId && w.car_id === carId);

  if (existingIndex !== -1) {
    store.wishlists.splice(existingIndex, 1);
    return res.json({ success: true, isSaved: false, message: 'Removed from wishlist' });
  } else {
    store.wishlists.push({ id: Date.now(), user_id: userId, car_id: carId });
    return res.json({ success: true, isSaved: true, message: 'Added to wishlist' });
  }
});

module.exports = router;
