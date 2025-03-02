const Business = require('../models/Business');
const geminiService = require('../services/geminiService');
const openaiService = require('../services/openaiService');
const runwayService = require('../services/runwayService');

// Generate text ad
exports.generateTextAd = async (req, res) => {
  try {
    // Get business info
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Generate ad content
    const adContent = await geminiService.generateAdContent(business);
    
    res.json({ adContent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Generate image ad
exports.generateImageAd = async (req, res) => {
  try {
    // Get business info
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Generate image prompt
    const imagePrompt = await geminiService.generateImagePrompt(business);
    
    // Generate image
    const imageUrl = await openaiService.generateImage(imagePrompt);
    
    // Generate ad content
    const adContent = await geminiService.generateAdContent(business);
    
    res.json({ imageUrl, adContent, prompt: imagePrompt });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Generate video ad
exports.generateVideoAd = async (req, res) => {
  try {
    // Get business info
    const business = await Business.findOne({ userId: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Generate video prompt
    const videoPrompt = await geminiService.generateVideoPrompt(business);
    
    // Generate video
    const videoUrl = await runwayService.generateVideo(videoPrompt);
    
    // Generate ad content
    const adContent = await geminiService.generateAdContent(business);
    
    res.json({ videoUrl, adContent, prompt: videoPrompt });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 