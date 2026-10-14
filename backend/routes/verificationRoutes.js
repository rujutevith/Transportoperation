const express = require('express');
const router = express.Router();
const store = require('../config/store');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get current user verification status
router.get('/status', verifyToken, (req, res) => {
  const record = store.verifications.find(v => v.user_id === req.user.id);
  const user = store.users.find(u => u.id === req.user.id);

  res.json({
    success: true,
    is_verified: !!user?.is_verified,
    status: record?.status || user?.verification_status || 'none',
    verification: record || null
  });
});

// Submit driver verification documents
router.post('/upload', verifyToken, (req, res) => {
  const {
    license_number,
    license_expiry,
    license_front_url,
    license_back_url,
    id_document_url
  } = req.body;

  if (!license_number || !license_front_url) {
    return res.status(400).json({ success: false, error: 'Driver license number and front image are required' });
  }

  let record = store.verifications.find(v => v.user_id === req.user.id);
  if (record) {
    record.license_number = license_number;
    record.license_expiry = license_expiry || record.license_expiry;
    record.license_front_url = license_front_url;
    record.license_back_url = license_back_url || record.license_back_url;
    record.id_document_url = id_document_url || record.id_document_url;
    record.status = 'pending';
    record.submitted_at = new Date().toISOString();
  } else {
    record = {
      id: Date.now(),
      user_id: req.user.id,
      license_number,
      license_expiry: license_expiry || '2030-01-01',
      license_front_url,
      license_back_url,
      id_document_url,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };
    store.verifications.push(record);
  }

  const user = store.users.find(u => u.id === req.user.id);
  if (user) {
    user.verification_status = 'pending';
  }

  res.json({
    success: true,
    message: 'Verification documents received. Our operations team reviews all submissions within 2-4 hours.',
    verification: record
  });
});

// Admin: Get all pending verifications
router.get('/all', verifyToken, verifyAdmin, (req, res) => {
  const list = store.verifications.map(v => {
    const user = store.users.find(u => u.id === v.user_id) || {};
    return {
      ...v,
      user_name: user.name || 'User',
      user_email: user.email || 'N/A',
      user_phone: user.phone || 'N/A'
    };
  });

  res.json({ success: true, verifications: list });
});

// Admin: Review verification
router.put('/review/:id', verifyToken, verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const record = store.verifications.find(v => v.id === Number(id));
  if (!record) {
    return res.status(404).json({ success: false, error: 'Verification record not found' });
  }

  record.status = status;
  record.admin_notes = admin_notes || '';
  record.reviewed_at = new Date().toISOString();

  const user = store.users.find(u => u.id === record.user_id);
  if (user) {
    user.is_verified = status === 'approved';
    user.verification_status = status;
  }

  res.json({ success: true, message: `Verification status updated to ${status}`, verification: record });
});

module.exports = router;
