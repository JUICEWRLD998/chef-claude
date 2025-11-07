// Header component with navigation between pages
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  // Get current URL path to determine which nav item is active
  const location = useLocation();
  
  // State: controls whether mobile menu is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  return (
    <header className="header">
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
          
          {/* Discover page - placeholder for future feature */}
          <li onClick={closeMobileMenu}>Discover</li>
        </ul>
      </nav>
    </header>
  )
}
