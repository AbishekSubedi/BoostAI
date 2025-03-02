// @ts-nocheck
const dotenv = require('dotenv');
dotenv.config();

const config = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyBl9Mw4wHrhQE6obGw1rJ7_um7vkqdAnnI',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your-openai-api-key',
  RUNWAY_API_KEY: process.env.RUNWAY_API_KEY,
  openai: {
    apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key'
  }
};

module.exports = config; 