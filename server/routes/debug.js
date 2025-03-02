const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/db-status', (req, res) => {
  const status = {
    connected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
    dbName: mongoose.connection.name,
    host: mongoose.connection.host,
    collections: Object.keys(mongoose.connection.collections).length
  };
  
  res.json(status);
});

router.get('/collections', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test-db', async (req, res) => {
  try {
    // Try to create a test document
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    
    // Count documents to verify
    const count = await testCollection.countDocuments();
    
    res.json({
      success: true,
      message: 'Database write test successful',
      count
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database write test failed',
      error: error.message
    });
  }
});

// Add this route to check if the server is working properly
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

module.exports = router; 