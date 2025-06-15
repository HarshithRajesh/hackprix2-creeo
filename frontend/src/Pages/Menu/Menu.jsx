import React from 'react';
import './Menu.css';
import { useNavigate } from 'react-router-dom';

const menuOptions = [
  { icon: 'fas fa-user-cog', label: 'Account Settings' },
  { icon: 'fas fa-bell', label: 'Notifications' },
  { icon: 'fas fa-shield-alt', label: 'Privacy' },
  { icon: 'fas fa-question-circle', label: 'Help Center' },
  { icon: 'fas fa-sign-out-alt', label: 'Logout' },
];

const Menu = () => {
  const navigate = useNavigate();

  const handleOptionClick = (label) => {
    if (label === 'Logout') {
      localStorage.clear(); 
      console.log('User logged out and localStorage cleared.');
      navigate('/');
    }
  };

  return (
    <div className="menu-page">
      <h2 className="menu-title">Menu</h2>
      <div className="menu-list">
        {menuOptions.map((option, idx) => (
          <div
            className="menu-card"
            key={idx}
            onClick={() => handleOptionClick(option.label)}
            style={{ cursor: 'pointer' }}
          >
            <i className={option.icon}></i>
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
