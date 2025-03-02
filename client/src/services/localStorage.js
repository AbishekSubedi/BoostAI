// Local storage service for storing business data

// Save business data to localStorage
export const saveBusinessData = (businessData) => {
  try {
    // Add timestamp and ID
    const enhancedData = {
      ...businessData,
      _id: 'local-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // If there's no enhanced profile, create a simple one
    if (!enhancedData.enhancedProfile) {
      enhancedData.enhancedProfile = {
        enhancedDescription: `${businessData.name} is a ${businessData.category} business located in ${businessData.location}. ${businessData.description}`,
        strengths: [
          "Quality products/services",
          "Customer-focused approach",
          "Experienced team",
          "Competitive pricing",
          "Innovative solutions"
        ],
        targetSegments: [
          "Local customers",
          "Online shoppers",
          "Business clients"
        ],
        marketingSuggestions: [
          "Develop a strong social media presence",
          "Create targeted email marketing campaigns",
          "Implement a customer referral program"
        ]
      };
    }
    
    // Save to localStorage
    localStorage.setItem('businessData', JSON.stringify(enhancedData));
    
    return {
      success: true,
      message: 'Business profile saved successfully',
      business: enhancedData
    };
  } catch (error) {
    console.error('Error saving business data to localStorage:', error);
    throw new Error('Failed to save business data');
  }
};

// Get business data from localStorage
export const getBusinessData = () => {
  try {
    const data = localStorage.getItem('businessData');
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting business data from localStorage:', error);
    return null;
  }
};

// Update business data in localStorage
export const updateBusinessData = (businessData) => {
  try {
    // Get existing data
    const existingData = getBusinessData();
    
    if (!existingData) {
      return saveBusinessData(businessData);
    }
    
    // Merge with existing data
    const updatedData = {
      ...existingData,
      ...businessData,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('businessData', JSON.stringify(updatedData));
    
    return {
      success: true,
      message: 'Business profile updated successfully',
      business: updatedData
    };
  } catch (error) {
    console.error('Error updating business data in localStorage:', error);
    throw new Error('Failed to update business data');
  }
};

// Delete business data from localStorage
export const deleteBusinessData = () => {
  try {
    localStorage.removeItem('businessData');
    return {
      success: true,
      message: 'Business profile deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting business data from localStorage:', error);
    throw new Error('Failed to delete business data');
  }
}; 