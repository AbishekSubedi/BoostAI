import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBusiness } from '../../services/api';

const BusinessSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    contactNumber: '',
    additionalInfo: '',
    targetAudience: '',
    yearsInBusiness: '',
    employeeCount: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const navigate = useNavigate();
  
  const { 
    name, 
    category, 
    description, 
    location, 
    contactNumber, 
    additionalInfo,
    targetAudience,
    yearsInBusiness,
    employeeCount,
    website
  } = formData;
  
  const businessCategories = [
    'Retail',
    'Food & Beverage',
    'Health & Wellness',
    'Professional Services',
    'Technology',
    'Education',
    'Home Services',
    'Beauty & Personal Care',
    'Automotive',
    'Entertainment',
    'Travel & Hospitality',
    'Manufacturing',
    'Construction',
    'Real Estate',
    'Financial Services',
    'Other'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  // Separate function for next button
  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Validate required fields for step 1
    if (step === 1) {
      if (!name || !category || !description || !location || !contactNumber) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    // Move to next step
    setStep(step + 1);
    setError('');
  };
  
  // Separate function for final submission
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Submitting business data:', formData);
      
      // Call the API to create business (now with localStorage fallback)
      const response = await createBusiness(formData);
      console.log('Business created:', response);
      
      // Show success message
      alert('Business profile created successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating business:', error);
      
      // Extract the error message
      let errorMessage = 'Failed to create business profile';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <div className="card">
        <h2>Business Setup</h2>
        <p className="subtitle">Tell us about your business to generate personalized AI content</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Business Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                required
                placeholder="Enter your business name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Business Category*</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {businessCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Business Description*</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Briefly describe what your business does"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Business Location*</label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={handleChange}
                required
                placeholder="City, State, Country"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number*</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={contactNumber}
                onChange={handleChange}
                required
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>
            
            <div className="form-buttons">
              <div></div> {/* Empty div for spacing */}
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleNextStep}>
            <h3>Additional Details</h3>
            
            <div className="form-group">
              <label htmlFor="targetAudience">Target Audience</label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={targetAudience}
                onChange={handleChange}
                placeholder="Who are your ideal customers?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="yearsInBusiness">Years in Business</label>
              <input
                type="number"
                id="yearsInBusiness"
                name="yearsInBusiness"
                value={yearsInBusiness}
                onChange={handleChange}
                placeholder="How long has your business been operating?"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="employeeCount">Number of Employees</label>
              <input
                type="number"
                id="employeeCount"
                name="employeeCount"
                value={employeeCount}
                onChange={handleChange}
                placeholder="How many people work at your business?"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="website">Website (if any)</label>
              <input
                type="url"
                id="website"
                name="website"
                value={website}
                onChange={handleChange}
                placeholder="https://yourbusiness.com"
              />
            </div>
            
            <div className="form-group">
              <label>Social Media Profiles (if any)</label>
              <input
                type="text"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleChange}
                placeholder="Facebook URL"
                className="mb-2"
              />
              <input
                type="text"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleChange}
                placeholder="Instagram URL"
                className="mb-2"
              />
              <input
                type="text"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleChange}
                placeholder="Twitter URL"
                className="mb-2"
              />
              <input
                type="text"
                name="socialMedia.linkedin"
                value={formData.socialMedia.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
              />
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={handleFinalSubmit}>
            <h3>AI-Enhanced Business Profile</h3>
            <p className="info-text">
              Please provide any additional information about your business. Our AI will analyze this to create a more detailed profile and generate better content for you.
            </p>
            
            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={additionalInfo}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us more about your business goals, unique selling points, challenges, products/services, competitive advantages, etc. The more information you provide, the better our AI can help you."
              />
              <small className="form-text">
                This information will be analyzed by AI to provide better recommendations and content for your business.
              </small>
            </div>
            
            <div className="form-buttons">
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessSetup; 