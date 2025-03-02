import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container">
      <div className="home-hero">
        <h1>Small Business AI Toolkit</h1>
        <p className="lead">
          Leverage the power of AI to grow your small business with our comprehensive toolkit.
        </p>
        
        {currentUser ? (
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard
          </Link>
        ) : (
          <div className="home-cta">
            <Link to="/login" className="btn btn-primary btn-lg">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Register
            </Link>
          </div>
        )}
      </div>
      
      <div className="features">
        <h2>Our AI-Powered Features</h2>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Website Generation</h3>
            <p>Create a professional website with AI-generated content tailored to your business.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Social Media Presence</h3>
            <p>Get detailed instructions on how to create and optimize social media accounts.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Ad Generation</h3>
            <p>Create eye-catching text, image, and video ads specifically tailored for your business.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Marketing Strategies</h3>
            <p>Get AI-generated marketing and advertising strategies based on current trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 