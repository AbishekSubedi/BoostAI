const Business = require('../models/Business');
const geminiService = require('../services/geminiService');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

// Generate text ad
exports.generateTextAd = async (req, res) => {
  try {
    const { description, adType, adPurpose, targetAudience, businessId, responseId } = req.body;
    
    // Generate ad options using Gemini AI
    const options = await geminiService.generateAdOptions(
      'text',
      description,
      adPurpose,
      targetAudience
    );
    
    return res.json({
      success: true,
      textAd: options[0], // Use the first option by default
      allOptions: options // Send all options
    });
  } catch (error) {
    console.error('Error generating text ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating text ad'
    });
  }
};

// Generate image ad
exports.generateImageAd = async (req, res) => {
  try {
    const { description, adType, adPurpose, targetAudience, businessId, responseId } = req.body;
    
    // Generate ad options using Gemini AI
    const concepts = await geminiService.generateAdOptions(
      'image',
      description,
      adPurpose,
      targetAudience
    );
    
    // For now, we'll return placeholder images with the concepts
    const imageOptions = concepts.map((concept, index) => {
      return {
        text: concept,
        imageUrl: `https://via.placeholder.com/600x400?text=Ad+Concept+${index + 1}`,
        caption: `Advertisement concept based on your business description`
      };
    });
    
    return res.json({
      success: true,
      imageUrl: imageOptions[0].imageUrl, // Use the first option by default
      caption: imageOptions[0].text,
      allOptions: imageOptions // Send all options
    });
  } catch (error) {
    console.error('Error generating image ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating image ad'
    });
  }
};

// Generate video ad
exports.generateVideoAd = async (req, res) => {
  try {
    const { description, adType, adPurpose, targetAudience, businessId, responseId } = req.body;
    
    // Generate ad options using Gemini AI
    const concepts = await geminiService.generateAdOptions(
      'video',
      description,
      adPurpose,
      targetAudience
    );
    
    // For now, we'll return placeholder videos with the concepts
    const videoOptions = concepts.map((concept, index) => {
      return {
        script: concept,
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', // Sample video
        thumbnail: `https://via.placeholder.com/600x400?text=Video+Concept+${index + 1}`
      };
    });
    
    return res.json({
      success: true,
      videoUrl: videoOptions[0].videoUrl, // Use the first option by default
      script: videoOptions[0].script,
      thumbnail: videoOptions[0].thumbnail,
      allOptions: videoOptions // Send all options
    });
  } catch (error) {
    console.error('Error generating video ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating video ad'
    });
  }
}; 