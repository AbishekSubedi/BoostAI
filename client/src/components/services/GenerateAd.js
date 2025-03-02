import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusiness, generateTextAd, generateImageAd, generateVideoAd, saveAdResponses, getAdResponses } from '../../services/api';
import Loading from '../common/Loading';
import './GenerateAd.css';

const GenerateAd = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adType, setAdType] = useState('text');
  const [generating, setGenerating] = useState(false);
  const [adResult, setAdResult] = useState(null);
  const [adOptions, setAdOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [description, setDescription] = useState('');
  const [adPurpose, setAdPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [savedResponses, setSavedResponses] = useState([]);
  
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
    
    // Load any previously saved responses from the server
    const loadSavedResponses = async () => {
      try {
        const responses = await getAdResponses();
        setSavedResponses(responses || []);
      } catch (error) {
        console.error('Error loading responses from server:', error);
        // Fall back to localStorage if server request fails
        const saved = localStorage.getItem('adGenerationResponses');
        if (saved) {
          try {
            setSavedResponses(JSON.parse(saved));
          } catch (e) {
            console.error('Error parsing saved responses:', e);
          }
        }
      }
    };
    
    fetchBusiness();
    loadSavedResponses();
  }, [navigate]);
  
  const saveUserResponses = () => {
    // Create a response object with all the user inputs
    const userResponse = {
      id: Date.now(), // Use timestamp as a simple unique ID
      timestamp: new Date().toISOString(),
      businessId: business?._id,
      businessName: business?.name,
      adType: adType,
      description: description,
      adPurpose: adPurpose,
      targetAudience: targetAudience,
      page: '/services/ads' // Add the page identifier
    };
    
    // Add to saved responses
    const updatedResponses = [...savedResponses, userResponse];
    setSavedResponses(updatedResponses);
    
    // Save to localStorage as backup
    localStorage.setItem('adGenerationResponses', JSON.stringify(updatedResponses));
    
    // Save to server
    saveAdResponses(updatedResponses).catch(err => {
      console.error('Failed to save responses to server:', err);
    });
    
    console.log('Saved user responses:', userResponse);
    
    return userResponse;
  };
  
  const handleGenerateAd = async () => {
    try {
      setGenerating(true);
      setError('');
      setAdResult(null);
      setAdOptions([]);
      setSelectedOption(0);
      
      // Save user responses first
      const userResponse = saveUserResponses();
      
      // Combine all inputs into a comprehensive description for the backend
      const adDetails = {
        description: description,
        adType: adType,
        adPurpose: adPurpose,
        targetAudience: targetAudience,
        businessId: business._id,
        responseId: userResponse.id // Include the response ID for reference
      };
      
      let result;
      
      if (adType === 'text') {
        result = await generateTextAd(adDetails);
      } else if (adType === 'image') {
        result = await generateImageAd(adDetails);
      } else if (adType === 'video') {
        result = await generateVideoAd(adDetails);
      }
      
      if (result && result.success) {
        setAdResult(result);
        
        // Set all options if available
        if (result.allOptions) {
          setAdOptions(result.allOptions);
        }
        
        // Update the saved response with the result
        const updatedResponses = savedResponses.map(resp => 
          resp.id === userResponse.id 
            ? { ...resp, result: result } 
            : resp
        );
        setSavedResponses(updatedResponses);
        
        // Save updated responses with result to localStorage and server
        localStorage.setItem('adGenerationResponses', JSON.stringify(updatedResponses));
        saveAdResponses(updatedResponses).catch(err => {
          console.error('Failed to update responses on server:', err);
        });
      } else {
        setError('Failed to generate advertisement');
      }
    } catch (error) {
      console.error('Error generating ad:', error);
      setError('Failed to generate advertisement: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };
  
  const selectOption = (index) => {
    setSelectedOption(index);
    
    // Update the current result based on the selected option
    if (adOptions && adOptions.length > index) {
      const option = adOptions[index];
      
      if (adType === 'text') {
        setAdResult({
          ...adResult,
          textAd: option
        });
      } else if (adType === 'image') {
        setAdResult({
          ...adResult,
          imageUrl: option.imageUrl,
          caption: option.text
        });
      } else if (adType === 'video') {
        setAdResult({
          ...adResult,
          videoUrl: option.videoUrl,
          script: option.script,
          thumbnail: option.thumbnail
        });
      }
    }
  };
  
  const downloadResponses = () => {
    // Create a JSON file with all saved responses
    const dataStr = JSON.stringify(savedResponses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'ad-generation-responses.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
  
  const renderAdOptions = () => {
    if (!adOptions || adOptions.length === 0) return null;
    
    return (
      <div className="ad-options-selector mb-4">
        <h4 className="mb-3">Choose Your Preferred Option:</h4>
        <div className="options-container">
          {adOptions.map((option, index) => (
            <div 
              key={index} 
              className={`option-card ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => selectOption(index)}
            >
              <div className="option-number">Option {index + 1}</div>
              {adType === 'text' ? (
                <div className="option-preview">
                  <p>{typeof option === 'string' ? option.substring(0, 100) + '...' : option.substring(0, 100) + '...'}</p>
                </div>
              ) : adType === 'image' ? (
                <div className="option-preview">
                  <div className="image-thumbnail">
                    <img src={option.imageUrl} alt={`Ad concept ${index + 1}`} />
                  </div>
                </div>
              ) : (
                <div className="option-preview">
                  <div className="video-thumbnail">
                    <img src={option.thumbnail} alt={`Video concept ${index + 1}`} />
                    <div className="play-icon"><i className="fas fa-play"></i></div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
            </div>
          </div>
          
          <div className="d-grid">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleGenerateAd}
              disabled={generating || !description.trim() || !adPurpose || !targetAudience.trim()}
            >
              {generating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating Your Advertisement...
                </>
              ) : (
                'Generate Advertisement'
              )}
            </button>
          </div>
          
          {savedResponses.length > 0 && (
            <div className="mt-3 text-center">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={downloadResponses}
              >
                <i className="fas fa-download me-1"></i> Download All Responses
              </button>
            </div>
          )}
        </div>
      </div>
      
      {adResult && (
        <div className="card mb-4 ad-result-container">
          <div className="card-body">
            <h3 className="card-title mb-4">Your Advertisement</h3>
            
            {renderAdOptions()}
            
            <div className="ad-result">
              {adType === 'text' && adResult.textAd && (
                <div className="text-ad-result">
                  <h4>Text Advertisement</h4>
                  <div className="text-ad-content">
                    <p>{adResult.textAd}</p>
                  </div>
                </div>
              )}
              
              {adType === 'image' && adResult.imageUrl && (
                <div className="image-ad-result">
                  <h4>Image Advertisement</h4>
                  <div className="image-ad-content">
                    <img src={adResult.imageUrl} alt="Generated Ad" className="img-fluid rounded" />
                    {adResult.caption && (
                      <p className="mt-3"><strong>Caption:</strong> {adResult.caption}</p>
                    )}
                  </div>
                </div>
              )}
              
              {adType === 'video' && adResult.videoUrl && (
                <div className="video-ad-result">
                  <h4>Video Advertisement</h4>
                  <div className="video-ad-content">
                    <video controls className="img-fluid rounded">
                      <source src={adResult.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {adResult.script && (
                      <div className="mt-3">
                        <h5>Video Script:</h5>
                        <p>{adResult.script}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="ad-actions mt-4">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i> Download
                </button>
                <button className="btn btn-outline-secondary ms-2">
                  <i className="fas fa-edit me-2"></i> Edit
                </button>
                <button className="btn btn-outline-success ms-2">
                  <i className="fas fa-share-alt me-2"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateAd; 