const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken } = require('../middleware/auth');

// Get reviews for a specific car
router.get('/car/:carId', (req, res) => {
  const carId = Number(req.params.carId);
  const reviews = store.reviews.filter(r => r.car_id === carId);

  res.json({
    success: true,
    count: reviews.length,
    reviews
  });
});

// Add a review
router.post('/', verifyToken, (req, res) => {
  const { car_id, rating = 5, title, comment } = req.body;

  if (!comment || !comment.trim()) {
    return res.status(400).json({ success: false, error: 'Review comment is required' });
  }

  const user = store.users.find(u => u.id === req.user.id);

  const newReview = {
    id: Date.now(),
    user_id: req.user.id,
    user_name: user?.name || req.user.name || 'Valued Client',
    car_id: car_id ? Number(car_id) : null,
    rating: Math.min(5, Math.max(1, Number(rating))),
    title: title || 'Customer Experience',
    comment: comment.trim(),
    created_at: new Date().toISOString()
  };

  store.reviews.unshift(newReview);

  // Recalculate car rating if applicable
  if (car_id) {
    const car = store.cars.find(c => c.id === Number(car_id));
    if (car) {
      const carReviews = store.reviews.filter(r => r.car_id === Number(car_id));
      const avg = carReviews.reduce((sum, r) => sum + r.rating, 0) / carReviews.length;
      car.rating = Number(avg.toFixed(1));
      car.reviews_count = carReviews.length;
    }
  }

  res.status(201).json({ success: true, message: 'Thank you for your review!', review: newReview });
});

module.exports = router;
