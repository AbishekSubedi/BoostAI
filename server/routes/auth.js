const express = require('express');
const router = express.Router();

// Register user
router.post('/register', (req, res) => {
  // In a real app, you would save the user to the database
  const { email, firebaseUid } = req.body;
  
  // Generate a dummy token
  const token = 'dummy-token-' + Date.now();
  
  res.json({ 
    success: true, 
    message: 'User registered successfully',
    token,
    user: {
      _id: Date.now().toString(),
      email,
      firebaseUid,
      displayName: email.split('@')[0]
    }
  });
});

// Get user by Firebase UID
router.get('/firebase/:firebaseUid', (req, res) => {
  const { firebaseUid } = req.params;
  const email = req.query.email || 'user@example.com';
  
  // Generate a dummy token
  const token = 'dummy-token-' + Date.now();
  
  // Return dummy user data for development
  res.json({ 
    success: true, 
    token, 
    user: {
      _id: Date.now().toString(),
      email,
      firebaseUid,
      displayName: email.split('@')[0]
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  // In a real app, you would verify the token and return the user
  const token = req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  // Return dummy user data
  res.json({ 
    success: true,
    user: {
      _id: Date.now().toString(),
      email: 'user@example.com',
      firebaseUid: 'dummy-firebase-uid',
      displayName: 'Test User'
    }
  });
});

// Add this route to create a test user for development
router.get('/create-test-user', async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Check if test user already exists
    let user = await User.findOne({ firebaseUid: 'test-user-id' });
    
    if (!user) {
      // Create test user
      user = new User({
        firebaseUid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User'
      });
      
      await user.save();
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }
    
    res.json({
      success: true,
      message: 'Test user ready',
      user
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create test user' 
    });
  }
});

module.exports = router; 