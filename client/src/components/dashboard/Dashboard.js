import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBusiness, deleteBusiness } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ServiceCard from './ServiceCard';
import Loading from '../common/Loading';

const Dashboard = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await getBusiness();
        
        if (data) {
          setBusiness(data);
          console.log('Business data loaded:', data);
        } else {
          console.log('No business found for this user');
          setBusiness(null);
          navigate('/business-setup');
        }
      } catch (error) {
        console.error('Error fetching business:', error);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusiness();
  }, [navigate]);
  
  const handleDeleteBusiness = async () => {
    try {
      setLoading(true);
      await deleteBusiness();
      setBusiness(null);
      setShowDeleteConfirm(false);
      alert('Business deleted successfully');
    } catch (error) {
      console.error('Error deleting business:', error);
      setError('Failed to delete business');
    } finally {
      setLoading(false);
    }
  };
  
  const services = [
    {
      id: 'website',
      title: 'Generate Website',
      description: 'Create a professional website with AI-generated content tailored to your business.',
      icon: '🌐',
      path: '/services/website'
    },
    {
      id: 'social',
      title: 'Social Media Presence',
      description: 'Get detailed instructions on how to create and optimize social media accounts for your business.',
      icon: '📱',
      path: '/services/social'
    },
    {
      id: 'ads',
      title: 'Generate Ads',
      description: 'Create eye-catching text, image, and video ads specifically tailored for your business.',
      icon: '🎯',
      path: '/services/ads'
    },
    {
      id: 'marketing',
      title: 'Marketing Strategies',
      description: 'Get AI-generated marketing and advertising strategies based on current trends.',
      icon: '📊',
      path: '/services/marketing'
    }
  ];
  
  if (loading) {
    return <Loading />;
  }
  
  if (error === 'businessNotFound') {
    return (
      <div className="container">
        <div className="card">
          <h2>Welcome to Small Business AI Toolkit!</h2>
          <p>It looks like you haven't set up your business profile yet.</p>
          <p>To get started with our AI-powered services, please create your business profile first.</p>
          <Link to="/business-setup" className="btn btn-primary mt-4">
            Set Up Business Profile
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.displayName || 'User'}</h1>
        <p>Manage your business and access AI-powered tools</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {business && (
        <div className="card">
          <div className="business-header">
            <h2>{business.name}</h2>
            <div className="business-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/business-setup')}
              >
                Edit Business
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Business
              </button>
            </div>
          </div>
          
          <div className="business-details">
            <p><strong>Category:</strong> {business.category}</p>
            <p><strong>Description:</strong> {business.description}</p>
            <p><strong>Location:</strong> {business.location}</p>
            <p><strong>Contact:</strong> {business.contactNumber}</p>
            
            {business.targetAudience && (
              <p><strong>Target Audience:</strong> {business.targetAudience}</p>
            )}
            
            {business.yearsInBusiness && (
              <p><strong>Years in Business:</strong> {business.yearsInBusiness}</p>
            )}
            
            {business.employeeCount && (
              <p><strong>Employees:</strong> {business.employeeCount}</p>
            )}
            
            {business.website && (
              <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
            )}
            
            {business.enhancedProfile && (
              <div className="enhanced-profile">
                <h3>AI-Enhanced Business Profile</h3>
                <p>{business.enhancedProfile.enhancedDescription}</p>
                
                <h4>Key Strengths</h4>
                <ul>
                  {business.enhancedProfile.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
                
                <h4>Target Customer Segments</h4>
                <ul>
                  {business.enhancedProfile.targetSegments.map((segment, index) => (
                    <li key={index}>{segment}</li>
                  ))}
                </ul>
                
                <h4>Marketing Suggestions</h4>
                <ul>
                  {business.enhancedProfile.marketingSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      <h2 className="services-heading">AI Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Business Profile</h3>
            <p>Are you sure you want to delete your business profile? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteBusiness}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 