const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { firebaseUid, email, displayName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      firebaseUid,
      email,
      displayName
    });

    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user by Firebase UID
exports.getUserByFirebaseUid = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 