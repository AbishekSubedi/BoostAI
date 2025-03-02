import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusiness } from '../../services/api';
import Loading from '../common/Loading';
import './GenerateWebsite.css';

const GenerateWebsite = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  
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
          setError('No business profile found');
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
  
  const generateWebsitePreview = () => {
    setGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setShowPreview(true);
      setGenerating(false);
    }, 1500);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  // Get color scheme based on business category
  const getColorScheme = (category) => {
    const categoryColors = {
      'Restaurant': { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12' },
      'Retail': { primary: '#3498db', secondary: '#2980b9', accent: '#e74c3c' },
      'Technology': { primary: '#2ecc71', secondary: '#27ae60', accent: '#3498db' },
      'Healthcare': { primary: '#3498db', secondary: '#2980b9', accent: '#2ecc71' },
      'Education': { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f1c40f' },
      'Finance': { primary: '#2c3e50', secondary: '#1a2530', accent: '#f39c12' },
      'Real Estate': { primary: '#16a085', secondary: '#1abc9c', accent: '#2c3e50' },
      'Fitness': { primary: '#e74c3c', secondary: '#c0392b', accent: '#3498db' },
      'Beauty': { primary: '#e84393', secondary: '#d63031', accent: '#fd79a8' },
      'Construction': { primary: '#f39c12', secondary: '#e67e22', accent: '#34495e' }
    };
    
    return categoryColors[category] || { primary: '#3498db', secondary: '#2980b9', accent: '#f1c40f' };
  };
  
  // Get social media links if available
  const getSocialLinks = () => {
    if (!business.socialMedia) return null;
    
    const links = [];
    if (business.socialMedia.facebook) links.push({ name: 'Facebook', url: business.socialMedia.facebook, icon: 'fab fa-facebook' });
    if (business.socialMedia.instagram) links.push({ name: 'Instagram', url: business.socialMedia.instagram, icon: 'fab fa-instagram' });
    if (business.socialMedia.twitter) links.push({ name: 'Twitter', url: business.socialMedia.twitter, icon: 'fab fa-twitter' });
    if (business.socialMedia.linkedin) links.push({ name: 'LinkedIn', url: business.socialMedia.linkedin, icon: 'fab fa-linkedin' });
    
    if (links.length === 0) return null;
    
    return (
      <div className="social-links">
        {links.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon">
            <i className={link.icon}></i>
          </a>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container">
      <div className="service-header">
        <h1>Website Generator</h1>
        <p>Create a professional website preview for your business in seconds</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card">
        <div className="business-summary">
          <h3>Business Details</h3>
          <p><strong>Name:</strong> {business?.name}</p>
          <p><strong>Category:</strong> {business?.category}</p>
          <p><strong>Description:</strong> {business?.description}</p>
          <p><strong>Location:</strong> {business?.location}</p>
          <p><strong>Contact:</strong> {business?.contactNumber}</p>
          
          {business?.website && (
            <p><strong>Website:</strong> {business.website}</p>
          )}
          
          {business?.targetAudience && (
            <p><strong>Target Audience:</strong> {business.targetAudience}</p>
          )}
          
          {business?.yearsInBusiness && (
            <p><strong>Years in Business:</strong> {business.yearsInBusiness}</p>
          )}
          
          {business?.employeeCount && (
            <p><strong>Employees:</strong> {business.employeeCount}</p>
          )}
          
          {business?.enhancedProfile && (
            <div className="enhanced-profile-summary">
              <p><strong>AI-Enhanced Profile:</strong> Included</p>
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn btn-primary" 
            onClick={generateWebsitePreview}
            disabled={generating}
          >
            {generating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              'Generate Website Preview'
            )}
          </button>
        </div>
      </div>
      
      {showPreview && business && (
        <div className="website-preview-container">
          <h2>Your Website Preview</h2>
          
          <div className="website-preview" style={{
            '--primary-color': getColorScheme(business.category).primary,
            '--secondary-color': getColorScheme(business.category).secondary,
            '--accent-color': getColorScheme(business.category).accent
          }}>
            {/* Header */}
            <header className="preview-header">
              <div className="preview-logo">
                <h1>{business.name}</h1>
              </div>
              <nav className="preview-nav">
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </nav>
            </header>
            
            {/* Hero Section */}
            <section id="home" className="preview-hero">
              <div className="preview-container">
                <h2>Welcome to {business.name}</h2>
                <p className="preview-tagline">{business.category} - Serving you with excellence</p>
                <p className="preview-hero-description">{business.description.split('.')[0]}.</p>
                <a href="#contact" className="preview-btn">Contact Us</a>
              </div>
            </section>
            
            {/* About Section */}
            <section id="about" className="preview-section">
              <div className="preview-container">
                <h2>About Us</h2>
                <div className="preview-about-content">
                  <div className="preview-about-text">
                    <p>{business.description}</p>
                    {business.yearsInBusiness && (
                      <p><strong>Years in Business:</strong> {business.yearsInBusiness}</p>
                    )}
                    {business.employeeCount && (
                      <p><strong>Team Size:</strong> {business.employeeCount} employees</p>
                    )}
                    {business.targetAudience && (
                      <p><strong>Target Audience:</strong> {business.targetAudience}</p>
                    )}
                    
                    {business.enhancedProfile && business.enhancedProfile.targetSegments && business.enhancedProfile.targetSegments.length > 0 && (
                      <div className="preview-target-segments">
                        <h3>Who We Serve</h3>
                        <ul>
                          {business.enhancedProfile.targetSegments.map((segment, index) => (
                            <li key={index}>{segment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Services Section */}
            <section id="services" className="preview-section">
              <div className="preview-container">
                <h2>Our Services</h2>
                <div className="preview-services-content">
                  {business.enhancedProfile && business.enhancedProfile.strengths && business.enhancedProfile.strengths.length > 0 && (
                    <div className="preview-strengths">
                      <h3>Our Strengths</h3>
                      <ul>
                        {business.enhancedProfile.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="preview-service-description">
                    <p>At {business.name}, we are committed to providing exceptional {business.category} services tailored to your needs.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Marketing Section (if available) */}
            {business.enhancedProfile && business.enhancedProfile.marketingSuggestions && business.enhancedProfile.marketingSuggestions.length > 0 && (
              <section id="marketing" className="preview-section">
                <div className="preview-container">
                  <h2>Our Marketing Approach</h2>
                  <ul className="preview-marketing-list">
                    {business.enhancedProfile.marketingSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
            
            {/* Contact Section */}
            <section id="contact" className="preview-section">
              <div className="preview-container">
                <h2>Contact Us</h2>
                <div className="preview-contact-content">
                  <div className="preview-contact-info">
                    <p><strong>Location:</strong> {business.location}</p>
                    <p><strong>Phone:</strong> {business.contactNumber}</p>
                    {business.website && (
                      <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>
                    )}
                    {business.email && (
                      <p><strong>Email:</strong> {business.email}</p>
                    )}
                  </div>
                  
                  <div className="preview-contact-form">
                    <h3>Send us a message</h3>
                    <form className="preview-form">
                      <div className="preview-form-group">
                        <label htmlFor="preview-name">Name</label>
                        <input type="text" id="preview-name" name="name" required />
                      </div>
                      <div className="preview-form-group">
                        <label htmlFor="preview-email">Email</label>
                        <input type="email" id="preview-email" name="email" required />
                      </div>
                      <div className="preview-form-group">
                        <label htmlFor="preview-message">Message</label>
                        <textarea id="preview-message" name="message" rows="5" required></textarea>
                      </div>
                      <button type="submit" className="preview-btn">Send Message</button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer */}
            <footer className="preview-footer">
              <div className="preview-container">
                <p>&copy; {new Date().getFullYear()} {business.name}. All rights reserved.</p>
                {getSocialLinks()}
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateWebsite; 