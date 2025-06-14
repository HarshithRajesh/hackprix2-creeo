import React from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const navClass = (path) => location.pathname === path ? 'nav-icon active' : 'nav-icon';

  return (
    <div className="navbar-container">
      <h1>Navbar</h1>
      <Link to="/profile" className={navClass('/profile')}>
        <i className="bi bi-person"></i>
      </Link>
      <Link to="/geolocation" className={navClass('/geolocation')}>
        <i className="bi bi-geo-alt"></i>
      </Link>
      <Link to="/" className={navClass('/')}>
        <i className="bi bi-house"></i>
      </Link>
      <Link to="/chats" className={navClass('/chats')}>
        <i className="bi bi-chat-dots"></i>
      </Link>
      <Link to="/menu" className={navClass('/menu')}>
        <i className="bi bi-list"></i>
      </Link>
    </div>
  );
}

export default Navbar;