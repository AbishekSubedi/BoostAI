const Business = require('../models/Business');
const geminiService = require('../services/geminiService');

// Generate social media guide
exports.generateSocialMediaGuide = async (req, res) => {
  try {
    const { platform } = req.body;
    
    // Get business info
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Generate social media guide
    const socialMediaGuide = await geminiService.generateSocialMediaGuide(business, platform);
    
    res.json({ socialMediaGuide });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 