const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Generate text ad
router.post('/text', auth, adController.generateTextAd);

// Generate image ad
router.post('/image', auth, adController.generateImageAd);

// Generate video ad
router.post('/video', auth, adController.generateVideoAd);

// Save ad generation responses
router.post('/responses', auth, async (req, res) => {
  try {
    const { responses } = req.body;
    const userId = req.user.id;
    
    // Create a file path for this user's responses
    const filePath = path.join(__dirname, '../data/ad-responses', `${userId}.json`);
    
    // Make sure the directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    // Write the responses to the file
    fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));
    
    return res.json({
      success: true,
      message: 'Ad responses saved successfully'
    });
  } catch (error) {
    console.error('Error saving ad responses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save ad responses'
    });
  }
});

// Get saved ad responses
router.get('/responses', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const filePath = path.join(__dirname, '../data/ad-responses', `${userId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.json({
        success: true,
        responses: []
      });
    }
    
    const responses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    return res.json({
      success: true,
      responses
    });
  } catch (error) {
    console.error('Error getting ad responses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get ad responses'
    });
  }
});

module.exports = router; 