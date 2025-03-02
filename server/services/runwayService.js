const axios = require('axios');
const config = require('../config/config');

// Generate video
exports.generateVideo = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.runwayml.com/v1/generationJob',
      {
        prompt: prompt,
        mode: "standard",
        length: 4, // 4 seconds video
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.RUNWAY_API_KEY}`
        }
      }
    );

    const jobId = response.data.id;
    
    // Poll for job completion
    let videoUrl = null;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max (10 seconds * 30)
    
    while (!videoUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const statusResponse = await axios.get(
        `https://api.runwayml.com/v1/generationJob/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${config.RUNWAY_API_KEY}`
          }
        }
      );
      
      if (statusResponse.data.status === 'COMPLETED') {
        videoUrl = statusResponse.data.output.url;
      } else if (statusResponse.data.status === 'FAILED') {
        throw new Error('Video generation failed');
      }
      
      attempts++;
    }
    
    if (!videoUrl) {
      throw new Error('Video generation timed out');
    }
    
    return videoUrl;
  } catch (error) {
    console.error('Error generating video with Runway:', error);
    throw new Error('Failed to generate video');
  }
}; 