import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileService } from '../../Service/api';
import './Profiles.css';

const Profiles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = parseInt(localStorage.getItem('userid'));
        if (!userId || isNaN(userId)) {
          setError('User ID not found or invalid in local storage.');
          setLoading(false);
          return;
        }

        const data = await profileService.fetchNearbyPeople(userId);
        // Map to match userDetails structure
        const mappedUsers = data.map((person) => ({
          Id: person.id,
          Name: person.name?.split(' (')[0] || 'Unknown',
          Interests: Array.isArray(person.Interests) ? person.Interests : ['No interests listed'],
          Description: person.description || 'No description available.',
          Age: person.age || Math.floor(Math.random() * (30 - 15 + 1)) + 15,
          Pronouns: person.pronouns || 'They/Them',
          Languages: person.languages || 'English',
          SocialLinks: person.socialLinks || {
            twitter: 'https://twitter.com/sampleuser',
            facebook: 'https://facebook.com/sampleuser',
            linkedin: 'https://linkedin.com/in/sampleuser',
          },
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load nearby users. Please try again.');
        // Fallback to hardcoded users
        setUsers([
          {
            Id: 5,
            Name: 'CK2',
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
          },
          {
            Id: 6,
            Name: 'Alex',
            Interests: ['coding', 'gaming'],
            Description: 'Tech enthusiast and gamer.',
            Age: 22,
            Pronouns: 'She/Her',
            Languages: 'English',
            SocialLinks: {
              twitter: 'https://twitter.com/alexuser',
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="profiles-page">Loading users...</div>;
  if (error) return <div className="profiles-page">Error: {error}</div>;

  return (
    <div className="profiles-page">
      <h1>Explore Profiles</h1>
      <div className="profiles-list">
        {users.map((user) => (
          <Link
            key={user.Id}
            to={`/profile/${user.Id}`}
            state={{ userDetails: user }}
            className="profile-card"
          >
            <img
              src={`https://randomuser.me/api/portraits/women/${user.Id % 100}.jpg`}
              alt={user.Name}
              className="profile-card-avatar"
            />
            <div className="profile-card-info">
              <h3>{user.Name}</h3>
              <p>{Array.isArray(user.Interests) ? user.Interests.join(', ') : 'No interests listed'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profiles;