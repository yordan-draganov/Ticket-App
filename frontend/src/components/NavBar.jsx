import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavBar.css";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          TicketApp<span className="logo-highlight">.</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
        </div>

        <div className={isMenuOpen ? "navbar-links active" : "navbar-links"}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Events</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/my-tickets" onClick={() => setIsMenuOpen(false)}>My Tickets</Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}