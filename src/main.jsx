// Main component - handles ingredient list and recipe generation
import React, { useState } from 'react';
import { marked } from 'marked';

export default function Main() {
  // State: input field value
  const [input, setInput] = useState('');
  
  // State: array of ingredient strings
  const [ingredients, setIngredients] = useState([]);
  
  // State: generated recipe text from AI
  const [recipe, setRecipe] = useState(null);
  
  // State: loading indicator while waiting for AI response
  const [loading, setLoading] = useState(false);
  
  // State: error message if API call fails
  const [error, setError] = useState(null);

  /**
   * Handle form submission - add ingredient to the list
   * Prevents empty/whitespace-only entries
   */
  const handleAddIngredient = (e) => {
    e.preventDefault(); // prevent page reload
    
    const trimmed = input.trim();
    
    // Only add if input is not empty
    if (trimmed) {
      setIngredients([...ingredients, trimmed]);
      setInput(''); // clear input field after adding
    }
  };

  /**
   * Remove an ingredient from the list by index
   */
  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  /**
   * Call the server proxy to generate a recipe from current ingredients
   * Server will use Gemini API to create the recipe
   */
  const handleGetRecipe = async () => {
    // Clear any previous errors
    setError(null);
    setLoading(true);
    
    try {
      // Call our secure server proxy endpoint
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients: ingredients.length > 0 
            ? ingredients 
            : ['no specific ingredients'] // handle empty case
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipe(data.recipe);
      } else {
        setError(data.error || 'Failed to generate recipe. Please try again.');
      }
    } catch (err) {
      console.error('Error calling recipe API:', err);
      setError('Could not connect to the recipe server. Make sure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      {/* Ingredient Input Form */}
      <form className="ingredient-form" onSubmit={handleAddIngredient}>
        <input 
          type="text" 
          placeholder="e.g. jollof rice" 
          aria-label="Add ingredient"
          className="ingredient-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="add-ingredient-btn">
          Add ingredient
        </button>
      </form>

      {/* Ingredient List - only show if there are ingredients */}
      {ingredients.length > 0 && (
        <div className="ingredients-section">
          <h2 className="section-title">Your Ingredients:</h2>
          <ul className="ingredient-list">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <span className="ingredient-text">{ingredient}</span>
                <button 
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveIngredient(index)}
                  aria-label={`Remove ${ingredient}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recipe Generation Call-to-Action */}
      {ingredients.length > 0 && (
        <div className="recipe-cta">
          <p className="cta-text">
            Ready for a recipe? Generate a recipe from the list of your ingredients.
          </p>
          <button 
            type="button"
            className="get-recipe-btn"
            onClick={handleGetRecipe}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Get Recipe'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Recipe Display Area */}
      {recipe && (
        <div className="recipe-section">
          <h2 className="section-title">Your Recipe:</h2>
          <div 
            className="recipe-content"
            dangerouslySetInnerHTML={{ __html: marked(recipe) }}
          />
        </div>
      )}
    </main>
  );
}