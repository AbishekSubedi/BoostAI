import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import BusinessSetup from './components/auth/BusinessSetup';
import GenerateWebsite from './components/services/GenerateWebsite';
import SocialMediaGuide from './components/services/SocialMediaGuide';
import GenerateAd from './components/services/GenerateAd';
import MarketingStrategy from './components/services/MarketingStrategy';
import './App.css';

// Private route component that checks if user is authenticated
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Route that checks if user has a business profile
const BusinessRequiredRoute = ({ children }) => {
  const { currentUser, hasBusiness, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!hasBusiness) {
    return <Navigate to="/business-setup" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/business-setup" 
            element={
              <PrivateRoute>
                <BusinessSetup />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <BusinessRequiredRoute>
                <Dashboard />
              </BusinessRequiredRoute>
            } 
          />
          <Route 
            path="/services/website" 
            element={
              <BusinessRequiredRoute>
                <GenerateWebsite />
              </BusinessRequiredRoute>
            } 
          />
          <Route 
            path="/services/social" 
            element={
              <BusinessRequiredRoute>
                <SocialMediaGuide />
              </BusinessRequiredRoute>
            } 
          />
          <Route 
            path="/services/ads" 
            element={
              <BusinessRequiredRoute>
                <GenerateAd />
              </BusinessRequiredRoute>
            } 
          />
          <Route 
            path="/services/marketing" 
            element={
              <BusinessRequiredRoute>
                <MarketingStrategy />
              </BusinessRequiredRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 