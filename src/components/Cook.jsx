// Cook page component - displays YouTube video tutorial for the generated recipe
import React, { useState, useEffect } from 'react';

export default function Cook() {
  // State: stores the recipe name that was generated on the Generate page
  const [recipeName, setRecipeName] = useState('');
  
  // State: stores the YouTube video ID to embed
  const [videoId, setVideoId] = useState('');
  
  // State: loading indicator while searching for video
  const [loading, setLoading] = useState(true);
  
  // State: error message if video search fails
  const [error, setError] = useState(null);

  /**
   * When component loads, get the recipe name from sessionStorage
   * (saved when user generates a recipe on the Generate page)
   */
  useEffect(() => {
    // Try to get the recipe name that was saved when user clicked "Get Recipe"
    const savedRecipe = sessionStorage.getItem('currentRecipeName');
    
    if (savedRecipe) {
      setRecipeName(savedRecipe);
      // Search for a YouTube cooking video for this recipe
      searchYouTubeVideo(savedRecipe);
    } else {
      // No recipe was generated yet - show message
      setError('No recipe generated yet. Please go to Generate page first.');
      setLoading(false);
    }
  }, []);

  /**
   * Search YouTube for a cooking tutorial video
   * Uses YouTube Data API via our server proxy
   * 
   * @param {string} recipe - The recipe name to search for
   */
  const searchYouTubeVideo = async (recipe) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call our server proxy to search YouTube
      // Server will use YOUTUBE_API_KEY to keep it secure
      const response = await fetch('http://localhost:3001/api/youtube-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: `${recipe} recipe cooking tutorial how to make`
        }),
      });

      const data = await response.json();

      if (data.success && data.videoId) {
        // Got a video! Store the video ID to display in iframe
        setVideoId(data.videoId);
      } else {
        setError(data.error || 'Could not find a cooking video for this recipe.');
      }
    } catch (err) {
      console.error('Error searching YouTube:', err);
      setError('Could not connect to the video search service. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content cook-page">
      <div className="cook-container">
        {/* Page Title */}
        <h1 className="cook-title">
          <img src="/youtube.png" alt="YouTube" className="youtube-icon" />
          Cook Along
        </h1>
        
        {/* Show recipe name if available */}
        {recipeName && (
          <h2 className="recipe-name">{recipeName}</h2>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-video">
            <p>🔍 Searching for the perfect cooking tutorial...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            
            {/* Show setup instructions if YouTube API is not configured */}
            {error.includes('YouTube API key not configured') && (
              <div className="setup-instructions">
                <h3>🎬 Want to see cooking videos?</h3>
                <p>To enable YouTube cooking tutorials:</p>
                <ol style={{ textAlign: 'left', maxWidth: '500px', margin: '1rem auto' }}>
                  <li>Get a free YouTube Data API key (see <code>YOUTUBE_SETUP.md</code>)</li>
                  <li>Add it to <code>server/.env</code></li>
                  <li>Restart the server</li>
                </ol>
                <p><strong>Note:</strong> The Generate page works fine without this!</p>
              </div>
            )}
            
            {!recipeName && (
              <a href="/" className="back-link">← Go back to Generate page</a>
            )}
          </div>
        )}

        {/* YouTube Video Display */}
        {!loading && !error && videoId && (
          <div className="video-container">
            <iframe
              className="youtube-video"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Cooking Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            
            {/* Video Description */}
            <div className="video-info">
              <p className="video-description">
                📺 Watch this tutorial to learn how to make <strong>{recipeName}</strong>. 
                Follow along step-by-step!
              </p>
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="watch-on-youtube"
              >
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        )}

        {/* No video but no error either - show default message */}
        {!loading && !error && !videoId && (
          <div className="no-video">
            <p>No cooking video found. Try generating a different recipe!</p>
            <a href="/" className="back-link">← Go back to Generate page</a>
          </div>
        )}
      </div>
    </main>
  );
}
