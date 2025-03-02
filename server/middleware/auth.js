const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
  try {
    // For development, always use a test user ID
    // This ensures we can create and retrieve business data consistently
    req.user = { 
      firebaseUid: 'test-user-id',
      email: 'test@example.com'
    };
    
    // Log authentication status for debugging
    console.log('Auth middleware: Using test user ID for development');
    
    return next();
    
    // The code below would be used in production
    /*
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
    */
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 