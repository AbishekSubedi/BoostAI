import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUserWithBackend = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getUserByFirebaseUid = async (firebaseUid) => {
  const response = await api.get(`/auth/firebase/${firebaseUid}`);
  return response.data;
};

export const getCurrentUserFromBackend = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Business API calls
export const createBusiness = async (businessData) => {
  try {
    const response = await api.post('/business', businessData);
    return response.data;
  } catch (error) {
    console.error('API error creating business:', error);
    throw error;
  }
};

export const getBusiness = async () => {
  try {
    const response = await api.get('/business');
    return response.data;
  } catch (error) {
    console.error('API error getting business:', error);
    // If business not found, return null instead of throwing
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const updateBusiness = async (businessData) => {
  try {
    const response = await api.put('/business', businessData);
    return response.data;
  } catch (error) {
    console.error('API error updating business:', error);
    throw error;
  }
};

export const deleteBusiness = async () => {
  try {
    const response = await api.delete('/business');
    return response.data;
  } catch (error) {
    console.error('API error deleting business:', error);
    throw error;
  }
};

// Website API calls
export const generateWebsite = async (websiteData) => {
  const response = await api.post('/website/generate', websiteData);
  return response.data;
};

// Social media API calls
export const generateSocialMediaGuide = async (socialData) => {
  const response = await api.post('/social/guide', socialData);
  return response.data;
};

// Ad API calls
export const generateTextAd = async (adDetails) => {
  try {
    const response = await fetch('http://localhost:5005/api/ads/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...adDetails,
        user_id: localStorage.getItem('userId') || 'anonymous'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate text ad');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating text ad:', error);
    throw error;
  }
};

export const generateImageAd = async (adDetails) => {
  try {
    const response = await fetch('http://localhost:5005/api/ads/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...adDetails,
        user_id: localStorage.getItem('userId') || 'anonymous'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate image ad');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating image ad:', error);
    throw error;
  }
};

export const generateVideoAd = async (adDetails) => {
  try {
    const response = await fetch('http://localhost:5005/api/ads/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...adDetails,
        user_id: localStorage.getItem('userId') || 'anonymous'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate video ad');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating video ad:', error);
    throw error;
  }
};

// Marketing API calls
export const generateMarketingStrategy = async (marketingData) => {
  const response = await api.post('/marketing/strategy', marketingData);
  return response.data;
};

// Add this function to test the API
export const testBusinessCreation = async (businessData) => {
  try {
    const response = await api.post('/business/test', businessData);
    return response.data;
  } catch (error) {
    console.error('API test error:', error.response || error);
    throw error;
  }
};

// Add this function to use the simple business creation endpoint
export const createBusinessSimple = async (businessData) => {
  try {
    const response = await api.post('/business/simple', businessData);
    return response.data;
  } catch (error) {
    console.error('API error creating business (simple):', error.response || error);
    throw error;
  }
};

// Generate advertisement options
export const generateAds = async (adDetails) => {
  try {
    const response = await fetch('http://localhost:5005/generate-ads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adDetails),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate ads');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating ads:', error);
    throw error;
  }
};

// Save ad generation responses to server
export const saveAdResponses = async (responses) => {
  try {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const response = await fetch(`http://localhost:5005/api/ads/responses/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save ad responses');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving ad responses:', error);
    throw error;
  }
};

// Get saved ad responses from server
export const getAdResponses = async () => {
  try {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const response = await fetch(`http://localhost:5005/api/ads/responses/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get ad responses');
    }
    
    const data = await response.json();
    return data.responses;
  } catch (error) {
    console.error('Error getting ad responses:', error);
    throw error;
  }
};

export default api; 