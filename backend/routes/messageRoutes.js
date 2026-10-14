const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken } = require('../middleware/auth');

// Get all message threads for the logged-in user
router.get('/conversations', verifyToken, (req, res) => {
  const userId = req.user.id;

  const relevantMessages = store.messages.filter(
    m => m.sender_id === userId || m.receiver_id === userId
  );

  // Group by other party
  const conversationsMap = {};
  relevantMessages.forEach(m => {
    const otherId = m.sender_id === userId ? m.receiver_id : m.sender_id;
    if (!conversationsMap[otherId]) {
      const otherUser = store.users.find(u => u.id === otherId) || { name: 'Dealer / Concierge' };
      const car = m.car_id ? store.cars.find(c => c.id === m.car_id) : null;
      conversationsMap[otherId] = {
        otherUser: { id: otherId, name: otherUser.name, role: otherUser.role },
        car: car ? { id: car.id, brand: car.brand, model: car.model, image_url: car.image_url } : null,
        lastMessage: m,
        unreadCount: (m.receiver_id === userId && !m.is_read) ? 1 : 0
      };
    }
  });

  res.json({
    success: true,
    conversations: Object.values(conversationsMap)
  });
});

// Get message thread between logged-in user and specific target
router.get('/thread/:targetUserId', verifyToken, (req, res) => {
  const userId = req.user.id;
  const targetId = Number(req.params.targetUserId);

  const thread = store.messages
    .filter(m => 
      (m.sender_id === userId && m.receiver_id === targetId) ||
      (m.sender_id === targetId && m.receiver_id === userId)
    )
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Mark messages to this user as read
  thread.forEach(m => {
    if (m.receiver_id === userId) {
      m.is_read = true;
    }
  });

  res.json({ success: true, messages: thread });
});

// Send a message
router.post('/send', verifyToken, (req, res) => {
  const { receiver_id = 1, car_id, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, error: 'Message content cannot be empty' });
  }

  const sender = store.users.find(u => u.id === req.user.id);

  const newMsg = {
    id: Date.now(),
    sender_id: req.user.id,
    sender_name: sender?.name || req.user.name || 'User',
    receiver_id: Number(receiver_id) || 1,
    car_id: car_id ? Number(car_id) : null,
    content: content.trim(),
    is_read: false,
    created_at: new Date().toISOString()
  };

  store.messages.push(newMsg);

  res.status(201).json({ success: true, message: newMsg });
});

module.exports = router;
