import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusiness, generateAds } from '../../services/api';
import Loading from '../common/Loading';
import './GenerateAds.css';

const GenerateAds = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [adOptions, setAdOptions] = useState([]);
  const [adType, setAdType] = useState('text'); // 'text', 'image', or 'video'
  const [description, setDescription] = useState('');
  const [adPurpose, setAdPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await getBusiness();
        
        if (data) {
          setBusiness(data);
          // Pre-populate description with business info
          setDescription(`${data.name} is a ${data.category} business. ${data.description}`);
          // Pre-populate target audience if available
          if (data.targetAudience) {
            setTargetAudience(data.targetAudience);
          }
        } else {
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
  
  const handleGenerateAds = async () => {
    try {
      setGenerating(true);
      setError('');
      setAdOptions([]);
      
      // Combine all inputs into a comprehensive description
      const fullDescription = `
Business Description: ${description}
Ad Type: ${adType}
Ad Purpose: ${adPurpose}
Target Audience: ${targetAudience}
Call to Action: ${callToAction}
      `.trim();
      
      const result = await generateAds(fullDescription);
      
      if (result && result.options) {
        setAdOptions(result.options);
      } else {
        setError('Failed to generate ad options');
      }
    } catch (error) {
      console.error('Error generating ads:', error);
      setError('Failed to generate ads: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };
  
  const renderBusinessSummary = () => {
    if (!business) return null;
    
    return (
      <div className="card mb-4 business-summary">
        <div className="card-body">
          <h4 className="card-title">Business Information</h4>
          <p><strong>Name:</strong> {business.name}</p>
          <p><strong>Category:</strong> {business.category}</p>
          {business.location && <p><strong>Location:</strong> {business.location}</p>}
          {business.website && <p><strong>Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer">{business.website}</a></p>}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="container">
      <div className="service-header">
        <h1>Advertisement Generator</h1>
        <p>Create compelling advertisements tailored to your business needs</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {renderBusinessSummary()}
      
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title mb-4">Create Your Advertisement</h3>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <h4 className="mb-3">1. Select Advertisement Type</h4>
              <div className="ad-type-selector">
                <div className={`ad-type-card ${adType === 'text' ? 'selected' : ''}`} onClick={() => setAdType('text')}>
                  <div className="ad-type-icon">
                    <i className="fas fa-font fa-2x"></i>
                  </div>
                  <h5>Text Ad</h5>
                  <p>Simple text-based advertisements for search engines, social media posts, or email campaigns.</p>
                </div>
                
                <div className={`ad-type-card ${adType === 'image' ? 'selected' : ''}`} onClick={() => setAdType('image')}>
                  <div className="ad-type-icon">
                    <i className="fas fa-image fa-2x"></i>
                  </div>
                  <h5>Image Ad</h5>
                  <p>Visual advertisements with compelling graphics for social media, websites, or print materials.</p>
                </div>
                
                <div className={`ad-type-card ${adType === 'video' ? 'selected' : ''}`} onClick={() => setAdType('video')}>
                  <div className="ad-type-icon">
                    <i className="fas fa-video fa-2x"></i>
                  </div>
                  <h5>Video Ad</h5>
                  <p>Dynamic video content for social media, websites, or TV commercials.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <h4 className="mb-3">2. Describe Your Business</h4>
              <div className="form-group mb-3">
                <label htmlFor="description" className="form-label">Business Description</label>
                <textarea 
                  id="description" 
                  className="form-control" 
                  rows="4" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business, products, or services..."
                ></textarea>
                <small className="text-muted">
                  Include key details about what makes your business unique.
                </small>
              </div>
            </div>
          </div>
          
          <div className="row mb-4">
            <div className="col-md-12">
              <h4 className="mb-3">3. Define Your Advertisement Goals</h4>
              
              <div className="form-group mb-3">
                <label htmlFor="adPurpose" className="form-label">What is the purpose of this ad?</label>
                <select 
                  id="adPurpose" 
                  className="form-select" 
                  value={adPurpose} 
                  onChange={(e) => setAdPurpose(e.target.value)}
                >
                  <option value="">Select a purpose...</option>
                  <option value="Increase brand awareness">Increase brand awareness</option>
                  <option value="Promote a specific product or service">Promote a specific product or service</option>
                  <option value="Announce a sale or special offer">Announce a sale or special offer</option>
                  <option value="Generate leads or sign-ups">Generate leads or sign-ups</option>
                  <option value="Drive website traffic">Drive website traffic</option>
                  <option value="Increase store visits">Increase store visits</option>
                  <option value="Boost app downloads">Boost app downloads</option>
                </select>
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="targetAudience" className="form-label">Who is your target audience?</label>
                <textarea 
                  id="targetAudience" 
                  className="form-control" 
                  rows="2" 
                  value={targetAudience} 
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Describe the demographics, interests, and behaviors of your ideal customers..."
                ></textarea>
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="callToAction" className="form-label">What action do you want people to take?</label>
                <input 
                  type="text" 
                  id="callToAction" 
                  className="form-control" 
                  value={callToAction} 
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="e.g., 'Shop now', 'Sign up today', 'Call for a free quote'..."
                />
              </div>
            </div>
          </div>
          
          <div className="d-grid">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleGenerateAds}
              disabled={generating || !description.trim() || !adPurpose || !targetAudience.trim()}
            >
              {generating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating Your Advertisements...
                </>
              ) : (
                'Generate Advertisements'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {adOptions.length > 0 && (
        <div className="card mb-4 ad-options-container">
          <div className="card-body">
            <h3 className="card-title mb-4">Your Advertisement Options</h3>
            
            <div className="ad-options">
              {adOptions.map((option, index) => (
                <div key={index} className="ad-option">
                  <h4>Option {index + 1}</h4>
                  <div className="ad-content">
                    {adType === 'text' ? (
                      <div className="text-ad">
                        <p>{option}</p>
                      </div>
                    ) : adType === 'image' ? (
                      <div className="image-ad">
                        <p>{option}</p>
                        <div className="image-placeholder">
                          <p>Image Ad Concept</p>
                          <small>Visual representation would be created based on this concept</small>
                        </div>
                      </div>
                    ) : (
                      <div className="video-ad">
                        <p>{option}</p>
                        <div className="video-placeholder">
                          <p>Video Ad Concept</p>
                          <small>Video storyboard would be created based on this concept</small>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ad-actions">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-download me-1"></i> Save
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-edit me-1"></i> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateAds; 