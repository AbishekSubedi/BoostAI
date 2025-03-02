const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const auth = require('../middleware/auth');

// Generate text ad
router.post('/text', auth, adController.generateTextAd);

// Generate image ad
router.post('/image', auth, adController.generateImageAd);

// Generate video ad
router.post('/video', auth, adController.generateVideoAd);

module.exports = router; 