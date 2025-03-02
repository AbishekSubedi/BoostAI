const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String
  },
  targetAudience: {
    type: String
  },
  yearsInBusiness: {
    type: Number
  },
  employeeCount: {
    type: Number
  },
  website: {
    type: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  enhancedProfile: {
    enhancedDescription: String,
    strengths: [String],
    targetSegments: [String],
    marketingSuggestions: [String]
  },
  user: {
    type: String,  // Store Firebase UID
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Business', BusinessSchema); 