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
