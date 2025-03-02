const Business = require('../models/Business');
const geminiService = require('../services/geminiService');

// Generate marketing strategy
exports.generateMarketingStrategy = async (req, res) => {
  try {
    const { budget, timeframe, goals } = req.body;
    
    // Get business info
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Generate marketing strategy
    const marketingStrategy = await geminiService.generateMarketingStrategy(
      business, 
      budget, 
      timeframe, 
      goals
    );
    
    res.json({ marketingStrategy });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 