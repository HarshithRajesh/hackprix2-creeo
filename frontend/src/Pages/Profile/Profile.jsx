import React, { useState } from 'react';
import './Profile.css';

const tabs = [
  { label: 'Posts', icon: 'fas fa-th' },
  { label: 'Photos', icon: 'fas fa-image' },
  { label: 'Videos', icon: 'fas fa-video' },
  { label: 'Follows', icon: 'fas fa-user-friends' },
  { label: 'Music', icon: 'fas fa-music' },
];

const photos = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to Photos

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img className="profile-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" />
        <div className="profile-info">
          <h2>Ruth Esther Crisp</h2>
          <span className="profile-badge">Master degree</span>
          <p className="profile-desc">Data science engineer, communicator, kind and ethical.</p>
          <div className="profile-actions">
            <button className="follow-btn">+ Following</button>
            <button className="message-btn">Message</button>
          </div>
        </div>
      </div>
      <div className="profile-tabs">
        {tabs.map((tab, idx) => (
          <div
            key={tab.label}
            className={`profile-tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            <i className={tab.icon}></i> {tab.label}
          </div>
        ))}
      </div>
      <div className="profile-content">
        {activeTab === 1 && (
          <div className="photo-grid">
            {photos.map((src, idx) => (
              <div className="photo-item" key={idx}>
                <img src={src} alt={`Photo ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
        {/* Add more tab content as needed */}
      </div>
    </div>
  );
};

export default Profile;
