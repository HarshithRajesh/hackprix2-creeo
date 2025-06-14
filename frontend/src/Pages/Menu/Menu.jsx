import React from 'react';
import './Menu.css';

const menuOptions = [
  { icon: 'fas fa-user-cog', label: 'Account Settings' },
  { icon: 'fas fa-bell', label: 'Notifications' },
  { icon: 'fas fa-shield-alt', label: 'Privacy' },
  { icon: 'fas fa-question-circle', label: 'Help Center' },
  { icon: 'fas fa-sign-out-alt', label: 'Logout' },
];

const Menu = () => {
  return (
    <div className="menu-page">
      <h2 className="menu-title">Menu</h2>
      <div className="menu-list">
        {menuOptions.map((option, idx) => (
          <div className="menu-card" key={idx}>
            <i className={option.icon}></i>
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
