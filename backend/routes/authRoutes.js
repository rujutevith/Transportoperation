const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../config/db');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert user
      const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [name, email, hashedPassword, role || 'customer'], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        // Create token
        const token = jwt.sign({ id: result.insertId, email, role: role || 'customer' }, 'your-jwt-secret', { expiresIn: '24h' });
        
        res.status(201).json({ 
          message: 'User registered successfully',
          token,
          user: { id: result.insertId, name, email, role: role || 'customer' }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'your-jwt-secret', { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });
});

// Google Login
router.post('/google', async (req, res) => {
  const { token } = req.body;
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    
    // Check if user exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      let user;
      if (results.length === 0) {
        // Create new user
        const insertQuery = 'INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [name, email, googleId, 'customer'], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          user = { id: result.insertId, name, email, role: 'customer' };
          const jwtToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'your-jwt-secret', { expiresIn: '24h' });
          
          res.json({ token: jwtToken, user });
        });
      } else {
        user = results[0];
        const jwtToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'your-jwt-secret', { expiresIn: '24h' });
        res.json({ token: jwtToken, user });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Forgot Password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    // Generate reset token (in production, send email)
    const resetToken = jwt.sign({ email }, 'reset-secret', { expiresIn: '1h' });
    
    res.json({ 
      message: 'Password reset link sent to your email',
      resetToken // In production, don't send this back, send email instead
    });
  });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const decoded = jwt.verify(token, 'reset-secret');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(query, [hashedPassword, decoded.email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ message: 'Password reset successfully' });
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'your-jwt-secret');
    const query = 'SELECT id, name, email, role FROM users WHERE id = ?';
    db.query(query, [decoded.id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;