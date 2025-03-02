import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateTextAd, generateImageAd, generateVideoAd } from '../../services/api';
import Loading from '../common/Loading';

const GenerateAd = () => {
  const [adType, setAdType] = useState('text');
  const [adResult, setAdResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let data;
      
      switch (adType) {
        case 'text':
          data = await generateTextAd();
          break;
        case 'image':
          data = await generateImageAd();
          break;
        case 'video':
          data = await generateVideoAd();
          break;
        default:
          throw new Error('Invalid ad type');
      }
      
      setAdResult(data);
    } catch (error) {
      setError(`Failed to generate ${adType} ad`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container">
        <Loading message={`Generating your ${adType} ad. This may take a minute...`} />
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="service-header">
        <h1>Generate Ads</h1>
        <p>Create eye-catching ads specifically tailored for your business</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!adResult ? (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Ad Type</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="text"
                    name="adType"
                    value="text"
                    checked={adType === 'text'}
                    onChange={() => setAdType('text')}
                  />
                  <label htmlFor="text">Text Ad</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="image"
                    name="adType"
                    value="image"
                    checked={adType === 'image'}
                    onChange={() => setAdType('image')}
                  />
                  <label htmlFor="image">Image Ad</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="video"
                    name="adType"
                    value="video"
                    checked={adType === 'video'}
                    onChange={() => setAdType('video')}
                  />
                  <label htmlFor="video">Video Ad</label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Generate {adType.charAt(0).toUpperCase() + adType.slice(1)} Ad
            </button>
          </form>
        </div>
      ) : (
        <div className="result-card">
          <h2>Your {adType.charAt(0).toUpperCase() + adType.slice(1)} Ad</h2>
          
          <div className="content-box">
            {adType === 'text' ? (
              <pre>{adResult.adContent}</pre>
            ) : adType === 'image' ? (
              <div className="ad-result">
                <img src={adResult.imageUrl} alt="Generated Ad" className="ad-image" />
                <div className="ad-content">
                  <h3>Ad Copy:</h3>
                  <pre>{adResult.adContent}</pre>
                </div>
              </div>
            ) : (
              <div className="ad-result">
                <video controls className="ad-video">
                  <source src={adResult.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="ad-content">
                  <h3>Ad Copy:</h3>
                  <pre>{adResult.adContent}</pre>
                </div>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <button
              onClick={() => {
                navigator.clipboard.writeText(adResult.adContent);
                alert('Ad content copied to clipboard!');
              }}
              className="btn btn-secondary"
            >
              Copy Ad Text
            </button>
            <button
              onClick={() => setAdResult(null)}
              className="btn btn-secondary"
            >
              Generate Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateAd; 