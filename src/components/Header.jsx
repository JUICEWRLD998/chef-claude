// Header component with navigation between pages
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

export default function Header() {
  // Get current URL path to determine which nav item is active
  const location = useLocation();
  const navigate = useNavigate();
  
  // State: controls whether mobile menu is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Ref to the header element for click-outside detection
  const headerRef = useRef(null);
  
  // Helper function to check if a nav item is active based on current path
  const isActive = (path) => location.pathname === path;
  
  /**
   * Toggle mobile menu open/closed
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  /**
   * Close mobile menu when a nav item is clicked
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  /**
   * Close mobile menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If menu is open and click is outside the header, close it
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    // Add event listener when menu is open
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  
  return (
    <header className="header" ref={headerRef}>
      {/* Logo and Title */}
      <div className="header-left">
        <img src="/chef.png" alt="Chef Logo" className="logo" />
        <h1>Chef Claude</h1>
      </div>
      
      {/* Hamburger Menu Button - only visible on mobile */}
      <button 
        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      
      {/* Navigation Menu */}
      <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul>
          {/* Generate/Home page link - active when path is "/" */}
          <li 
            className={isActive('/') ? 'active' : ''} 
            aria-current={isActive('/') ? 'page' : undefined}
          >
            <Link to="/" onClick={closeMobileMenu}>Generate</Link>
          </li>
          
          {/* Cook page link - active when path is "/cook" */}
          <li 
            className={isActive('/cook') ? 'active' : ''} 
            aria-current={isActive('/cook') ? 'page' : undefined}
          >
            <Link to="/cook" onClick={closeMobileMenu}>Cook</Link>
          </li>
          
          {/* Discover page link - active when path is "/discover" */}
          <li 
            className={isActive('/discover') ? 'active' : ''} 
            aria-current={isActive('/discover') ? 'page' : undefined}
          >
            <Link to="/discover" onClick={closeMobileMenu}>Discover</Link>
          </li>
          
          {/* Logout button */}
          <li className="logout-item">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}
