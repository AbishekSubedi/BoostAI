const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Analyze business information
exports.analyzeBusinessInfo = async (additionalInfo, businessName, category) => {
  try {
    const prompt = `
      Analyze the following information about a business named "${businessName}" in the "${category}" category:
      
      ${additionalInfo}
      
      Please provide a structured analysis including:
      1. Key strengths of the business
      2. Target audience
      3. Unique selling propositions
      4. Potential growth areas
      5. Recommended focus areas for marketing
      
      Format the response in a clear, professional manner.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing business info with Gemini:', error);
    throw new Error('Failed to analyze business information');
  }
};

// Generate ad content
exports.generateAdContent = async (business) => {
  try {
    const prompt = `
      Create compelling ad copy for a business with the following details:
      
      Business Name: ${business.name}
      Category: ${business.category}
      Description: ${business.description}
      Location: ${business.location || 'Not specified'}
      
      Additional Business Information:
      ${business.analyzedInfo || business.additionalInfo || 'Not provided'}
      
      Generate a short, engaging advertisement text that highlights the unique value proposition of this business.
      The ad should be attention-grabbing and persuasive, with a clear call to action.
      Keep it under 150 words.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating ad content with Gemini:', error);
    throw new Error('Failed to generate ad content');
  }
};

// Generate image prompt
exports.generateImagePrompt = async (business) => {
  try {
    const prompt = `
      Create a detailed prompt for an AI image generator to create an advertisement image for the following business:
      
      Business Name: ${business.name}
      Category: ${business.category}
      Description: ${business.description}
      Location: ${business.location || 'Not specified'}
      
      Additional Business Information:
      ${business.analyzedInfo || business.additionalInfo || 'Not provided'}
      
      The prompt should describe a visually appealing advertisement image that represents the business well.
      Include details about style, mood, colors, and what elements should be in the image.
      Make it detailed enough for an AI image generator to create a compelling advertisement.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating image prompt with Gemini:', error);
    throw new Error('Failed to generate image prompt');
  }
};

// Generate video prompt
exports.generateVideoPrompt = async (business) => {
  try {
    const prompt = `
      Create a detailed prompt for an AI video generator to create a short advertisement video for the following business:
      
      Business Name: ${business.name}
      Category: ${business.category}
      Description: ${business.description}
      Location: ${business.location || 'Not specified'}
      
      Additional Business Information:
      ${business.analyzedInfo || business.additionalInfo || 'Not provided'}
      
      The prompt should describe a 5-10 second video advertisement that effectively showcases the business.
      Include details about style, mood, colors, movement, and what elements should be in the video.
      Make it detailed enough for an AI video generator to create a compelling advertisement.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating video prompt with Gemini:', error);
    throw new Error('Failed to generate video prompt');
  }
};

// Generate website content
exports.generateWebsiteContent = async (business, websiteType, additionalRequirements) => {
  try {
    const prompt = `
      Generate website content for a business with the following details:
      
      Business Name: ${business.name}
      Category: ${business.category}
      Description: ${business.description}
      Location: ${business.location || 'Not specified'}
      Contact: ${business.contactNumber || 'Not specified'}
      
      Additional Business Information:
      ${business.analyzedInfo || business.additionalInfo || 'Not provided'}
      
      Website Type: ${websiteType}
      Additional Requirements: ${additionalRequirements || 'None specified'}
      
      Please generate:
      1. Homepage content including headline, subheadline, and main sections
      2. About Us page content
      3. Services/Products page content
      4. Contact page content
      5. Suggestions for additional pages if relevant
      
      Format the content in a structured way that could be directly used for website development.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating website content with Gemini:', error);
    throw new Error('Failed to generate website content');
  }
};

// Generate social media guide
exports.generateSocialMediaGuide = async (business, platform) => {
  try {
    const prompt = `
      Create a detailed guide for establishing and growing a presence on ${platform} for a business with the following details:
      
      Business Name: ${business.name}
      Category: ${business.category}
      Description: ${business.description}
      
      Additional Business Information:
      ${business.analyzedInfo || business.additionalInfo || 'Not provided'}
      
      The guide should include:
      1. Step-by-step instructions for setting up a ${platform} account
      2. Tips for optimizing the profile
      3. Content strategy recommendations specific to this business
      4. Posting frequency and best times to post
      5. Engagement strategies
      6. Growth tactics
      7. Performance metrics to track
      8. KPIs and success metrics
      9. Potential challenges and mitigation strategies
      
      Make the guide practical, actionable, and tailored to this specific business.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating social media guide with Gemini:', error);
    throw new Error('Failed to generate social media guide');
  }
};

// Generate marketing strategy
exports.generateMarketingStrategy = async (business, budget, timeframe, goals) => {
  try {
    const prompt = `
      Develop a comprehensive marketing strategy for a business with the following details:
      
      Business Name: ${business.name}
      Category: ${business.category}
      Description: ${business.description}
      Location: ${business.location || 'Not specified'}
      
      Additional Business Information:
      ${business.analyzedInfo || business.additionalInfo || 'Not provided'}
      
      Budget: ${budget || 'Not specified'}
      Timeframe: ${timeframe || '3 months'}
      Goals: ${goals || 'Increase brand awareness and customer acquisition'}
      
      The marketing strategy should include:
      1. Executive summary
      2. Target audience analysis
      3. Competitive analysis
      4. Marketing channels to focus on
      5. Content strategy
      6. Budget allocation
      7. Timeline with key milestones
      8. KPIs and success metrics
      9. Potential challenges and mitigation strategies
      
      Make the strategy realistic, actionable, and tailored to the specific business and its goals.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating marketing strategy with Gemini:', error);
    throw new Error('Failed to generate marketing strategy');
  }
};

// Generate ad options using Gemini AI
exports.generateAdOptions = async (adFormat, description, advertisementGoals, targetAudience) => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create the prompt
    const prompt = `
    Create three distinct advertisement options in **${adFormat}** format for the following product or business:

    **Description:** ${description}
    **Advertisement Goals:** ${advertisementGoals}
    **Target Audience:** ${targetAudience}

    Ensure the ads align with the given goals and target audience.
    
    Label each option clearly as:
    ## Option 1:
    ## Option 2:
    ## Option 3:
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract options using regex
    const options = text.split(/## Option \d+:/g)
      .filter(option => option.trim().length > 0)
      .map(option => option.trim());
    
    return options;
  } catch (error) {
    console.error('Gemini AI API error:', error);
    throw new Error('Failed to generate ad options with Gemini AI');
  }
}; 