const Business = require('../models/Business');
const geminiService = require('../services/geminiService');

// Generate website content
exports.generateWebsite = async (req, res) => {
  try {
    const { websiteType, additionalRequirements } = req.body;
    
    // Get business info
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Generate website content
    const websiteContent = await geminiService.generateWebsiteContent(
      business, 
      websiteType, 
      additionalRequirements
    );
    
    res.json({ websiteContent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 