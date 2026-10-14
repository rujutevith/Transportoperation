const express = require('express');
const router = express.Router();

const contactSubmissions = [];
const newsletterSubscribers = [];

// Contact form message submission
router.post('/submit', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, error: 'Email and message are required' });
  }

  const submission = {
    id: Date.now(),
    name: name || 'Website Visitor',
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    created_at: new Date().toISOString()
  };

  contactSubmissions.unshift(submission);

  res.json({
    success: true,
    message: 'Message delivered! Our customer support representative will get back to you within 30 minutes.'
  });
});

// Newsletter subscription
router.post('/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email address required' });
  }

  if (!newsletterSubscribers.includes(email.toLowerCase())) {
    newsletterSubscribers.push(email.toLowerCase());
  }

  res.json({
    success: true,
    message: '🎉 Successfully subscribed to EliteRent exclusive fleet announcements and VIP offers!'
  });
});

module.exports = router;
