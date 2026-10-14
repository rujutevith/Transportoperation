const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_to_something_random';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

const verifyDealerOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'dealer' && req.user.role !== 'admin')) {
    return res.status(403).json({ success: false, error: 'Dealer or Admin access required' });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyDealerOrAdmin,
  JWT_SECRET
};
