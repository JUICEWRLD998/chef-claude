// Main component - handles ingredient list and recipe generation
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

export default function Main() {
  // State: input field value
  const [input, setInput] = useState('');
  
  // State: array of ingredient strings - load from localStorage on mount
  const [ingredients, setIngredients] = useState(() => {
    // Try to load saved ingredients from localStorage
    const saved = localStorage.getItem('chefClaude_ingredients');
    return saved ? JSON.parse(saved) : [];
  });
  
  // State: generated recipe text from AI - load from localStorage on mount
  const [recipe, setRecipe] = useState(() => {
    // Try to load saved recipe from localStorage
    return localStorage.getItem('chefClaude_recipe') || null;
  });
  
  // State: loading indicator while waiting for AI response
  const [loading, setLoading] = useState(false);
  
  // State: error message if API call fails
  const [error, setError] = useState(null);

  /**
   * Save ingredients to localStorage whenever they change
   * This persists the ingredient list across page refreshes
   */
  useEffect(() => {
    localStorage.setItem('chefClaude_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  /**
   * Save recipe to localStorage whenever it changes
   * This persists the generated recipe across page refreshes
   */
  useEffect(() => {
    if (recipe) {
      localStorage.setItem('chefClaude_recipe', recipe);
    }
  }, [recipe]);

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
   * Clear all ingredients and recipe - start fresh
   */
  const handleClearAll = () => {
    setIngredients([]);
    setRecipe(null);
    setError(null);
    // Also clear from localStorage
    localStorage.removeItem('chefClaude_ingredients');
    localStorage.removeItem('chefClaude_recipe');
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
        
        // Extract recipe title from the generated recipe
        // The AI usually puts the title in the first line with # markdown or as the first sentence
        // Save it to sessionStorage so Cook page can use it to search YouTube
        const recipeLines = data.recipe.split('\n');
        let recipeTitle = recipeLines[0].replace(/^#+\s*/, '').trim(); // Remove markdown # symbols
        
        // If the title is too long (over 80 chars), it's likely a description, not just a title
        // Take only the first sentence or first 80 characters
        if (recipeTitle.length > 80) {
          // Try to extract just the title (before first colon, period, or exclamation)
          const titleMatch = recipeTitle.match(/^([^:.!]{1,80})/);
          if (titleMatch) {
            recipeTitle = titleMatch[1].trim();
          } else {
            // Fallback: just take first 80 characters
            recipeTitle = recipeTitle.substring(0, 80).trim();
          }
        }
        
        sessionStorage.setItem('currentRecipeName', recipeTitle);
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
          <div className="section-header">
            <h2 className="section-title">Your Ingredients:</h2>
            <button 
              type="button"
              className="clear-all-btn"
              onClick={handleClearAll}
              aria-label="Clear all ingredients"
            >
              Clear All
            </button>
          </div>
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
