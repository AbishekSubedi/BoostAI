import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/firebase';
import { registerUserWithBackend } from '../../services/api';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const { email, password, confirmPassword, businessName } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Validate first step
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setStep(2);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Register with Firebase
      const firebaseUser = await registerUser(email, password);
      
      // Register with backend
      await registerUserWithBackend({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: businessName
      });
      
      // Navigate to business setup
      navigate('/business-setup');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleNextStep}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={businessName}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary mt-2"
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </form>
        )}
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 