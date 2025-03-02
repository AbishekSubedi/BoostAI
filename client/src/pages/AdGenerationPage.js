import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Grid, Paper, CircularProgress } from '@mui/material';
import { generateAds, saveAdResponses, getAdResponses } from '../services/api';
import '../styles/AdGeneration.css';

const AdGenerationPage = () => {
  const [adType, setAdType] = useState('image');
  const [description, setDescription] = useState('');
  const [advertisementGoals, setAdvertisementGoals] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [adOptions, setAdOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedResponses, setSavedResponses] = useState([]);

  useEffect(() => {
    // Load saved responses when component mounts
    loadSavedResponses();
  }, []);

  const loadSavedResponses = async () => {
    try {
      const responses = await getAdResponses();
      setSavedResponses(responses || []);
    } catch (error) {
      console.error('Error loading saved responses:', error);
    }
  };

  const handleGenerateAd = async () => {
    setLoading(true);
    try {
      const response = await generateAds({
        ad_format: adType,
        description,
        advertisement_goals: advertisementGoals,
        target_audience: targetAudience
      });
      
      setAdOptions(response.options || []);
      
      // Save the response
      await saveAdResponses([
        ...savedResponses,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ad_format: adType,
          description,
          advertisement_goals: advertisementGoals,
          target_audience: targetAudience,
          options: response.options || []
        }
      ]);
      
      // Reload saved responses
      loadSavedResponses();
    } catch (error) {
      console.error('Error generating ad:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
        AI Advertisement Generator
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Generate Advertisement
        </Typography>
        
        <Grid container spacing={2}>
          {/* Remove text ad option and only keep image and video */}
          <Grid item xs={12} sm={6}>
            <Button 
              fullWidth
              variant={adType === 'image' ? 'contained' : 'outlined'}
              onClick={() => setAdType('image')}
              sx={{ height: '100%' }}
            >
              Image Advertisement
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              fullWidth
              variant={adType === 'video' ? 'contained' : 'outlined'}
              onClick={() => setAdType('video')}
              sx={{ height: '100%' }}
            >
              Video Advertisement
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business/Product Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Advertisement Goals"
              multiline
              rows={2}
              value={advertisementGoals}
              onChange={(e) => setAdvertisementGoals(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Target Audience"
              multiline
              rows={2}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </Grid>
        </Grid>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={handleGenerateAd}
          disabled={loading || !description || !advertisementGoals || !targetAudience}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Advertisement'}
        </Button>
      </Paper>
      
      {/* Increase the size of options display */}
      {adOptions.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Generated Options
          </Typography>
          
          <Grid container spacing={3}>
            {adOptions.map((option, index) => (
              <Grid item xs={12} key={index}>
                <Paper 
                  elevation={2} 
                  className="ad-option"
                  sx={{ 
                    p: 4, 
                    minHeight: '300px',  // Increase minimum height even more
                    fontSize: '1.2rem',  // Increase font size more
                    lineHeight: '1.8',   // Increase line height more
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Option {index + 1}
                  </Typography>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{option}</div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      
      {/* Previous responses section */}
      {savedResponses.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Previous Responses
          </Typography>
          
          {savedResponses.map((response, index) => (
            <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                {new Date(response.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Type: {response.ad_format}, 
                Description: {response.description.substring(0, 50)}...
              </Typography>
              <Button 
                size="small" 
                onClick={() => {
                  setAdOptions(response.options || []);
                  setAdType(response.ad_format);
                  setDescription(response.description);
                  setAdvertisementGoals(response.advertisement_goals);
                  setTargetAudience(response.target_audience);
                }}
              >
                View Details
              </Button>
            </Paper>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default AdGenerationPage; 