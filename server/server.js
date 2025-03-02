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

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    
    // Set up a retry mechanism
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => {
      mongoose.connect(config.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB on retry'))
        .catch(retryErr => {
          console.error('Failed to connect to MongoDB on retry:', retryErr);
          console.log('Using in-memory fallback for development');
        });
    }, 5000);
  });

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

const PORT = config.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 