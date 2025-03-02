const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const auth = require('../middleware/auth');

// Create business
router.post('/', auth, businessController.createBusiness);

// Get business by user
router.get('/', auth, businessController.getBusinessByUser);

// Update business
router.put('/', auth, businessController.updateBusiness);

// Delete business
router.delete('/', auth, businessController.deleteBusiness);

// For development/testing - get a demo business without auth
router.get('/demo', (req, res) => {
  res.json({
    name: 'Demo Business',
    category: 'Technology',
    description: 'A demo business for testing',
    location: 'New York, NY',
    contactNumber: '555-123-4567',
    enhancedProfile: {
      enhancedDescription: "Demo Business is a cutting-edge technology company specializing in innovative solutions for small businesses.",
      strengths: [
        "Innovative technology solutions",
        "Experienced team",
        "Customer-focused approach",
        "Affordable pricing",
        "Excellent support"
      ],
      targetSegments: [
        "Small businesses",
        "Startups",
        "E-commerce companies"
      ],
      marketingSuggestions: [
        "Focus on social media marketing",
        "Create educational content",
        "Offer free trials"
      ]
    }
  });
});

// Add this route for testing
router.post('/test', (req, res) => {
  console.log('Test business creation endpoint hit');
  console.log('Request body:', req.body);
  
  res.status(201).json({
    success: true,
    message: 'Test business creation successful',
    business: {
      ...req.body,
      _id: 'test-id-' + Date.now(),
      user: 'test-user-id',
      createdAt: new Date()
    }
  });
});

// Add this route for a simplified business creation
router.post('/simple', (req, res) => {
  try {
    console.log('Simple business creation endpoint hit');
    console.log('Request body:', req.body);
    
    // Validate required fields
    const { name, category, description, location, contactNumber } = req.body;
    if (!name || !category || !description || !location || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Create a dummy enhanced profile
    const enhancedProfile = {
      enhancedDescription: `${name} is a ${category} business located in ${location}. ${description}`,
      strengths: [
        "Quality products/services",
        "Customer-focused approach",
        "Experienced team",
        "Competitive pricing",
        "Innovative solutions"
      ],
      targetSegments: [
        "Local customers",
        "Online shoppers",
        "Business clients"
      ],
      marketingSuggestions: [
        "Develop a strong social media presence",
        "Create targeted email marketing campaigns",
        "Implement a customer referral program"
      ]
    };
    
    res.status(201).json({
      success: true,
      message: 'Business profile created successfully (simple mode)',
      business: {
        ...req.body,
        enhancedProfile,
        _id: 'simple-id-' + Date.now(),
        user: 'test-user-id',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error in simple business creation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create business profile',
      error: error.message
    });
  }
});

module.exports = router; 