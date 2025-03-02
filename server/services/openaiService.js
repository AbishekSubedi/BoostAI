const { OpenAI } = require('openai');
const config = require('../config/config');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

// Generate content using OpenAI
exports.generateContent = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a creative advertising expert who specializes in creating compelling ad copy.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content with OpenAI');
  }
};

// Generate image using OpenAI
exports.generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });
    
    return response.data[0].url;
  } catch (error) {
    console.error('OpenAI Image API error:', error);
    throw new Error('Failed to generate image with OpenAI');
  }
}; 