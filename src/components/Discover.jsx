// Discover page - vertical scrolling feed of food shorts (like YouTube Shorts)
import React, { useState, useEffect, useRef } from 'react';

/**
 * Discover component - YouTube Shorts style vertical video feed
 * Users scroll through random food-related short videos
 * Click to play/pause, scroll to next video
 */
export default function Discover() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const containerRef = useRef(null);

  // Fetch food shorts on mount
  useEffect(() => {
    fetchFoodShorts();
  }, []);

  /**
   * Fetch random food-related short videos
   * Server will search for cooking shorts/reels
   */
  const fetchFoodShorts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/youtube-discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: 'cooking recipe food shorts quick tutorial',
          maxResults: 20
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVideos(data.videos || []);
      } else {
        setError(data.error || 'Could not load videos.');
      }
    } catch (err) {
      console.error('Discover fetch error:', err);
      setError('Server not reachable. Make sure it\'s running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more videos when user reaches the end
   */
  const loadMoreVideos = () => {
    fetchFoodShorts();
  };

  return (
    <div className="discover-shorts-page">
      {/* Loading State */}
      {loading && videos.length === 0 && (
        <div className="shorts-loading">
          <div className="spinner"></div>
          <p>Loading delicious videos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="shorts-error">
          <p>⚠️ {error}</p>
          <button onClick={fetchFoodShorts} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Vertical Scrolling Feed */}
      {!error && videos.length > 0 && (
        <div className="shorts-feed" ref={containerRef}>
          {videos.map((video, index) => (
            <div key={`${video.videoId}-${index}`} className="short-card">
              {/* Full-screen video container */}
              <div className="short-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&mute=0`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              {/* Video info overlay */}
              <div className="short-info">
                <h3 className="short-title">{video.title}</h3>
                <p className="short-channel">{video.channelTitle}</p>
                <a 
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                >
                  Watch on YouTube ↗
                </a>
              </div>
            </div>
          ))}

          {/* Load More Trigger */}
          {!loading && (
            <div className="load-more-trigger">
              <button onClick={loadMoreVideos} className="load-more-btn">
                Load More Videos
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
