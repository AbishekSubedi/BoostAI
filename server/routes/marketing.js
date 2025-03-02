const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');
const auth = require('../middleware/auth');

// Generate marketing strategy
router.post('/strategy', auth, marketingController.generateMarketingStrategy);

module.exports = router; 