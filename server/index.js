/**
 * Chef Claude - Secure Server Proxy
 * 
 * This Express server acts as a secure proxy between the React frontend
 * and the Gemini AI API. It keeps your API key safe on the server side
 * and prevents exposure in the client-side JavaScript bundle.
 * 
 * Security: Never commit your real .env file with the actual API key to Git!
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware: Enable CORS for requests from Vite dev server (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173', // Vite default dev server
  credentials: true
}));

// Middleware: Parse JSON request bodies
app.use(express.json());

/**
 * POST /api/generate
 * 
 * Receives a list of ingredients from the client and generates a recipe
 * using the Gemini AI API. Returns the generated recipe text.
 * 
 * Request body: { ingredients: ['rice', 'tomato', ...] }
 * Response: { success: true, recipe: "..." } or { success: false, error: "..." }
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Validate that we have ingredients
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: ingredients array is required'
      });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('ERROR: GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: API key not configured'
      });
    }

    // Build the prompt for Gemini
    const ingredientList = ingredients.join(', ');
    const prompt = `You are a helpful chef assistant. A user has these ingredients: ${ingredientList}.

Create a complete, delicious recipe using most or all of these ingredients. If the ingredients are limited or unusual, be creative and suggest reasonable additions or substitutions.

Please provide:
1. A catchy recipe title
2. A complete ingredients list (include the user's ingredients plus any additions)
3. Clear, step-by-step cooking instructions
4. Estimated cooking time and servings

Keep the recipe practical and easy to follow for home cooks.`;

    console.log('Generating recipe for ingredients:', ingredientList);

    // Call Gemini API using axios with v1 endpoint and gemini-2.5-flash (latest stable model)
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const geminiResponse = await axios.post(geminiEndpoint, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });

    // Extract the generated text from Gemini's response format
    const recipe = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No recipe generated';

    console.log('Recipe generated successfully');

    // Return the recipe to the client
    res.json({
      success: true,
      recipe: recipe
    });

  } catch (error) {
    console.error('Server error:', error.message);
    
    // Handle axios-specific errors
    if (error.response) {
      console.error('Gemini API error status:', error.response.status);
      console.error('Gemini API error data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: `Gemini API error: ${error.response.data?.error?.message || error.response.statusText}`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error while generating recipe: ' + error.message
    });
  }
});

/**
 * POST /api/youtube-search
 * 
 * Searches YouTube for a cooking tutorial video based on the recipe name.
 * Uses YouTube Data API v3 to find the most relevant cooking video.
 * 
 * Request body: { query: "chicken curry recipe cooking tutorial" }
 * Response: { success: true, videoId: "abc123..." } or { success: false, error: "..." }
 */
app.post('/api/youtube-search', async (req, res) => {
  try {
    const { query } = req.body;

    // Validate that we have a search query
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: search query is required'
      });
    }

    // Get YouTube API key from environment variable
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    
    if (!youtubeApiKey) {
      console.error('ERROR: YOUTUBE_API_KEY not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: YouTube API key not configured'
      });
    }

    console.log('Searching YouTube for:', query);

    // Call YouTube Data API v3 to search for videos
    // Search parameters:
    // - part=snippet: Get video metadata
    // - maxResults=1: Only get the top result
    // - type=video: Only search for videos (not playlists/channels)
    // - order=relevance: Sort by most relevant
    // - videoDefinition=high: Prefer HD videos
    const youtubeEndpoint = 'https://www.googleapis.com/youtube/v3/search';
    
    const youtubeResponse = await axios.get(youtubeEndpoint, {
      params: {
        key: youtubeApiKey,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        order: 'relevance',
        videoDefinition: 'high',
        safeSearch: 'strict'
      },
      timeout: 10000
    });

    // Check if we got any results
    if (!youtubeResponse.data.items || youtubeResponse.data.items.length === 0) {
      return res.json({
        success: false,
        error: 'No cooking videos found for this recipe'
      });
    }

    // Extract the video ID from the first result
    const videoId = youtubeResponse.data.items[0].id.videoId;

    console.log('Found YouTube video:', videoId);

    // Return the video ID to the client
    res.json({
      success: true,
      videoId: videoId
    });

  } catch (error) {
    console.error('YouTube search error:', error.message);
    
    // Handle axios-specific errors
    if (error.response) {
      console.error('YouTube API error status:', error.response.status);
      console.error('YouTube API error data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: `YouTube API error: ${error.response.data?.error?.message || error.response.statusText}`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error while searching YouTube: ' + error.message
    });
  }
});

/**
 * POST /api/youtube-discover
 * 
 * Fetches multiple cooking videos for the Discover page
 * Returns array of video objects with id, title, thumbnail, channel
 * 
 * Request body: { query: "pasta recipe tutorial", maxResults: 12 }
 * Response: { success: true, videos: [{videoId, title, thumbnail, channelTitle}, ...] }
 */
app.post('/api/youtube-discover', async (req, res) => {
  try {
    const { query, maxResults = 12 } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: search query is required'
      });
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    
    if (!youtubeApiKey) {
      console.error('ERROR: YOUTUBE_API_KEY not found');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: YouTube API key not configured'
      });
    }

    console.log('Discover: searching YouTube for:', query, '(max:', maxResults, ')');

    // Search YouTube for food videos
    // Use safeSearch and add "recipe cooking" to ensure food content only
    // videoDuration: 'short' filters for videos < 4 minutes (YouTube Shorts are < 60s)
    const youtubeEndpoint = 'https://www.googleapis.com/youtube/v3/search';
    
    const youtubeResponse = await axios.get(youtubeEndpoint, {
      params: {
        key: youtubeApiKey,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: Math.min(maxResults, 20), // cap at 20
        order: 'relevance',
        videoDefinition: 'high',
        videoDuration: 'short', // Filter for short videos (< 4 minutes, includes Shorts)
        safeSearch: 'strict',
        videoCategoryId: '26' // YouTube category 26 = Howto & Style (includes cooking)
      },
      timeout: 10000
    });

    if (!youtubeResponse.data.items || youtubeResponse.data.items.length === 0) {
      return res.json({
        success: true,
        videos: []
      });
    }

    // Extract video details
    const videos = youtubeResponse.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description
    }));

    console.log(`Discover: found ${videos.length} videos`);

    res.json({
      success: true,
      videos: videos
    });

  } catch (error) {
    console.error('YouTube discover error:', error.message);
    
    if (error.response) {
      console.error('YouTube API error status:', error.response.status);
      console.error('YouTube API error data:', error.response.data);
      return res.status(error.response.status).json({
        success: false,
        error: `YouTube API error: ${error.response.data?.error?.message || error.response.statusText}`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching discover videos: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chef Claude server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🍳 Chef Claude server running on http://localhost:${PORT}`);
  console.log(`✅ CORS enabled for: http://localhost:5173`);
  console.log(`🔐 API Key status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'NOT FOUND - Please add to .env file'}`);
});
