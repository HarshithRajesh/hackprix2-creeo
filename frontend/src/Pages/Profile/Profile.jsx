import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileService } from '../../Service/api';
import './Profile.css';

const tabs = [
  { label: 'Friends', icon: 'fas fa-th' },
  { label: 'Posts', icon: 'fas fa-user-friends' },
];

const photos = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
];

const samplePosts = [
  { id: 1, content: 'Just finished a great hike!', timestamp: '2025-06-14 10:00 AM' },
  { id: 2, content: 'Loving this new album 🎶', timestamp: '2025-06-13 3:00 PM' },
  { id: 3, content: 'Art exhibition was amazing!', timestamp: '2025-06-12 7:00 PM' },
];

const Profile = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1); // Default to Posts
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = parseInt(localStorage.getItem('userid'));
  const effectiveUserId = userid ? parseInt(userid) : loggedInUserId;
  const isEditMode = effectiveUserId === loggedInUserId && !isNaN(loggedInUserId);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!effectiveUserId || isNaN(effectiveUserId)) {
        setError('Invalid or missing user ID.');
        setLoading(false);
        return;
      }

      try {
        const response = await profileService.getProfile(effectiveUserId);
        setUserDetails(response);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err?.Error || 'Failed to load profile. Please try again.');
        // Fallback data only if appropriate
        setUserDetails({
          Id: effectiveUserId,
          Name: 'Unknown User',
          Interests: ['music', 'art', 'vibing'],
          Description: 'This is a sample user profile description.',
          Age: 15,
          Pronouns: 'He/Him',
          Languages: 'English, Hindi',
          SocialLinks: {
            twitter: 'https://twitter.com/sampleuser',
            facebook: 'https://facebook.com/sampleuser',
            linkedin: 'https://linkedin.com/in/sampleuser',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [effectiveUserId]);

  if (loading) return <div className="profile-page">Loading profile...</div>;
  if (error) return <div className="profile-page">Error: {error}</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={`https://randomuser.me/api/portraits/women/${effectiveUserId % 100}.jpg`}
          alt="Profile"
        />
        <div className="profile-info">
          <h2>{userDetails?.Name || 'Unknown'}</h2>
          <span className="profile-badge">{userDetails?.Pronouns || 'No pronouns'}</span>
          <p className="profile-desc">{userDetails?.Description || 'No description available.'}</p>
          <p className="profile-details">
            <strong>Age:</strong> {userDetails?.Age || 'N/A'} |{' '}
            <strong>Languages:</strong> {userDetails?.Languages || 'N/A'}
          </p>
          <p className="profile-interests">
            <strong>Interests:</strong>{' '}
            {Array.isArray(userDetails?.Interests)
              ? userDetails.Interests.join(', ') || 'No interests listed.'
              : 'No interests listed.'}
          </p>
          <div className="profile-social-links">
            {userDetails?.SocialLinks?.twitter && (
              <a href={userDetails.SocialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {userDetails?.SocialLinks?.facebook && (
              <a href={userDetails.SocialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
            )}
            {userDetails?.SocialLinks?.linkedin && (
              <a href={userDetails.SocialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            )}
          </div>
          {!isEditMode && (
            <div className="profile-actions">
              <button className="follow-btn">Wave hi</button>
              <button onClick={() => navigate(`/chats`)} className="message-btn">Message</button>
            </div>
          )}
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
        {activeTab === 0 && (
          <div className="friends-list">
            <p>No friends data available yet.</p>
          </div>
        )}
        {activeTab === 1 && (
          <div className="posts-list">
            {samplePosts.map((post) => (
              <div key={post.id} className="post-item">
                <p>{post.content}</p>
                <span className="post-timestamp">{post.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;