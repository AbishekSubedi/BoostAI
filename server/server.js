const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const dotenv = require('dotenv');

// Route imports
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const websiteRoutes = require('./routes/website');
const socialRoutes = require('./routes/social');
const adsRoutes = require('./routes/ads');
const marketingRoutes = require('./routes/marketing');
const debugRoutes = require('./routes/debug');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set environment
process.env.NODE_ENV = 'development';

// Initialize SQLite database
const db = require('./config/db');
db.init();
console.log('Using SQLite database');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/debug', debugRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Try different ports if the default one is in use
const tryPort = (port) => {
  // Convert port to number to ensure proper incrementing
  port = Number(port);
  
  // Validate port number
  if (isNaN(port) || port < 0 || port >= 65536) {
    console.error(`Invalid port number: ${port}. Using default port 3000.`);
    port = 3000;
  }
  
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      // Properly increment port as a number
      tryPort(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

const PORT = process.env.PORT || 5001;
tryPort(PORT); 