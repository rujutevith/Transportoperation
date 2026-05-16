const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==================== HELPER FUNCTIONS ====================

const generateToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'your-jwt-secret-key',
    { expiresIn: '24h' }
  );
};

// ==================== REGISTER ====================

router.post('/register', async (req, res) => {
  console.log('📝 Register request:', { body: req.body });
  
  const { name, email, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields',
      message: 'Name, email and password are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }
  
  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters long'
    });
  }
  
  try {
    // Check if user exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error',
          message: err.message 
        });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ 
          success: false,
          error: 'User already exists',
          message: 'Email already registered'
        });
      }
      
      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert user
        const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const userRole = role || 'customer';
        
        db.query(insertQuery, [name, email, hashedPassword, userRole], (err, result) => {
          if (err) {
            console.error('❌ Insert error:', err);
            return res.status(500).json({ 
              success: false,
              error: 'Database error',
              message: err.message 
            });
          }
          
          // Generate token
          const token = generateToken(result.insertId, email, userRole);
          
          res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            token,
            user: { 
              id: result.insertId, 
              name, 
              email, 
              role: userRole 
            }
          });
        });
      } catch (hashError) {
        console.error('❌ Hash error:', hashError);
        res.status(500).json({ 
          success: false,
          error: 'Error processing password'
        });
      }
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
});

// ==================== LOGIN ====================

router.post('/login', (req, res) => {
  console.log('🔐 Login request:', { email: req.body.email });
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email and password are required'
    });
  }
  
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error'
      });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const user = results[0];
    
    // Check if user has password (not Google-only)
    if (!user.password) {
      return res.status(401).json({ 
        success: false,
        error: 'Please login with Google',
        useGoogle: true
      });
    }
    
    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid credentials'
        });
      }
      
      const token = generateToken(user.id, user.email, user.role);
      
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        }
      });
    } catch (compareError) {
      console.error('❌ Password compare error:', compareError);
      res.status(500).json({ 
        success: false,
        error: 'Error verifying credentials'
      });
    }
  });
});

// ==================== GOOGLE LOGIN ====================

router.post('/google', async (req, res) => {
  console.log('🌐 Google login request');
  
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      success: false,
      error: 'Google token is required'
    });
  }
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    
    // Check if user exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error'
        });
      }
      
      let user;
      let newUser = false;
      
      if (results.length === 0) {
        // Create new user
        const insertQuery = 'INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [name, email, googleId, 'customer'], (err, result) => {
          if (err) {
            console.error('❌ Insert error:', err);
            return res.status(500).json({ 
              success: false,
              error: 'Database error'
            });
          }
          
          user = { id: result.insertId, name, email, role: 'customer' };
          const jwtToken = generateToken(user.id, user.email, user.role);
          
          res.json({ 
            success: true,
            message: 'Google login successful',
            token: jwtToken, 
            user,
            isNewUser: true
          });
        });
      } else {
        user = results[0];
        const jwtToken = generateToken(user.id, user.email, user.role);
        
        res.json({ 
          success: true,
          message: 'Google login successful',
          token: jwtToken, 
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          isNewUser: false
        });
      }
    });
  } catch (error) {
    console.error('❌ Google auth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Google authentication failed: ' + error.message
    });
  }
});

// ==================== GET CURRENT USER ====================

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key');
    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    
    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error'
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({ 
        success: true,
        user: results[0] 
      });
    });
  } catch (error) {
    console.error('❌ Token error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Invalid token'
    });
  }
});

// ==================== FORGOT PASSWORD ====================

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false,
      error: 'Email is required'
    });
  }
  
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error'
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Email not found'
      });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { email }, 
      process.env.RESET_SECRET || 'reset-secret-key', 
      { expiresIn: '1h' }
    );
    
    // In production, send email here
    res.json({ 
      success: true,
      message: 'Password reset link sent to your email',
      resetToken // Remove this in production
    });
  });
});

// ==================== RESET PASSWORD ====================

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ 
      success: false,
      error: 'Token and new password are required'
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters long'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.RESET_SECRET || 'reset-secret-key');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(query, [hashedPassword, decoded.email], (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error'
        });
      }
      
      res.json({ 
        success: true,
        message: 'Password reset successfully'
      });
    });
  } catch (error) {
    console.error('❌ Reset error:', error);
    res.status(400).json({ 
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

// ==================== GET ALL USERS (Admin only) ====================

router.get('/users', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key');
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Admin access required'
      });
    }
    
    const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error'
        });
      }
      
      res.json({ 
        success: true,
        users: results 
      });
    });
  } catch (error) {
    console.error('❌ Token error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Invalid token'
    });
  }
});

// ==================== LOGOUT ====================

router.post('/logout', (req, res) => {
  res.json({ 
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;