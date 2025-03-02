import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSocialMediaGuide } from '../../services/api';
import Loading from '../common/Loading';

const SocialMediaGuide = () => {
  const [platform, setPlatform] = useState('');
  const [socialMediaGuide, setSocialMediaGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const platforms = [
    'TikTok',
    'YouTube',
    'Instagram',
    'Facebook',
    'LinkedIn',
    'Twitter',
    'Pinterest'
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await generateSocialMediaGuide({ platform });
      setSocialMediaGuide(data.socialMediaGuide);
    } catch (error) {
      setError('Failed to generate social media guide');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container">
        <Loading message="Generating your social media guide. This may take a minute..." />
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="service-header">
        <h1>Social Media Presence</h1>
        <p>Get detailed instructions on how to create and optimize social media accounts for your business</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!socialMediaGuide ? (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="platform">Select Platform</label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
              >
                <option value="">Select a platform</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={!platform}>
              Generate Guide
            </button>
          </form>
        </div>
      ) : (
        <div className="result-card">
          <h2>{platform} Guide for Your Business</h2>
          <div className="content-box">
            <pre>{socialMediaGuide}</pre>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => {
                navigator.clipboard.writeText(socialMediaGuide);
                alert('Guide copied to clipboard!');
              }}
              className="btn btn-secondary"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setSocialMediaGuide(null)}
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

export default SocialMediaGuide; 