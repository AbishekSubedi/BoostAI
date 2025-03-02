const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const auth = require('../middleware/auth');

// Generate social media guide
router.post('/guide', auth, socialController.generateSocialMediaGuide);

module.exports = router; 