import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMarketingStrategy } from '../../services/api';
import Loading from '../common/Loading';

const MarketingStrategy = () => {
  const [formData, setFormData] = useState({
    budget: '',
    timeframe: '',
    goals: ''
  });
  const [marketingStrategy, setMarketingStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const { budget, timeframe, goals } = formData;
  
  const timeframeOptions = [
    '1 month',
    '3 months',
    '6 months',
    '1 year'
  ];
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await generateMarketingStrategy(formData);
      setMarketingStrategy(data.marketingStrategy);
    } catch (error) {
      setError('Failed to generate marketing strategy');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container">
        <Loading message="Generating your marketing strategy. This may take a minute..." />
      </div>
    );
  }
  
  return (
    <div className="container">
      <div className="service-header">
        <h1>Marketing Strategies</h1>
        <p>Get AI-generated marketing and advertising strategies based on current trends</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!marketingStrategy ? (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="budget">Marketing Budget</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={budget}
                onChange={handleChange}
                placeholder="e.g., $500/month, $5,000 total, etc."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="timeframe">Timeframe</label>
              <select
                id="timeframe"
                name="timeframe"
                value={timeframe}
                onChange={handleChange}
              >
                <option value="">Select a timeframe</option>
                {timeframeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="goals">Marketing Goals</label>
              <textarea
                id="goals"
                name="goals"
                value={goals}
                onChange={handleChange}
                rows={3}
                placeholder="Describe what you want to achieve with your marketing efforts"
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Generate Marketing Strategy
            </button>
          </form>
        </div>
      ) : (
        <div className="result-card">
          <h2>Your Marketing Strategy</h2>
          <div className="content-box">
            <pre>{marketingStrategy}</pre>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => {
                navigator.clipboard.writeText(marketingStrategy);
                alert('Strategy copied to clipboard!');
              }}
              className="btn btn-secondary"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setMarketingStrategy(null)}
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

export default MarketingStrategy; 