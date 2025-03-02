// @ts-nocheck
const dotenv = require('dotenv');
dotenv.config();

const config = {
  PORT: process.env.PORT || 5001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'your_gemini_api_key',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key',
  RUNWAY_API_KEY: process.env.RUNWAY_API_KEY
};

module.exports = config; 