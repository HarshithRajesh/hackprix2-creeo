// Geolocation.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../Components';
import './Geolocation.css';

const Geolocation = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      // Check if location exists in localStorage
      const savedLocation = localStorage.getItem('location');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          setUserLocation(parsedLocation);
          simulateNearbyPeople(parsedLocation);
          return;
        } catch (e) {
          console.error('Failed to parse saved location', e);
          // Continue to get fresh location if parsing fails
        }
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('location', JSON.stringify(location));
            
            setUserLocation(location);
            simulateNearbyPeople(location);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 5, // 5 minutes
            timeout: 10000
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    const simulateNearbyPeople = (location) => {
      // Simulation data - replace with actual API call
      const simulatedPeople = [
        {
          id: 1,
          name: 'Person Nearby',
          interests: ['music', 'hiking', 'photography'],
          distance: 0.5 // km
        },
        {
          id: 2,
          name: 'Neighbor',
          interests: ['reading', 'cooking', 'travel'],
          distance: 1.2 // km
        }
      ];

      setCards(simulatedPeople.map(person => ({
        id: person.id,
        name: person.name,
        interests: person.interests,
        distance: person.distance,
        age: null,
        pronouns: null,
        role: null
      })));
      setLoading(false);
    };

    getLocation();
  }, []);

  const handleRefreshLocation = () => {
    localStorage.removeItem('location');
    setLoading(true);
    setError(null);
    getLocation();
  };

  if (loading) return <div className="geolocation-container">Loading your location...</div>;
  if (error) return <div className="geolocation-container">Error: {error}</div>;

  return (
    <div className="geolocation-container">
      <h1>Nearby People</h1>
      {userLocation && (
        <div className="location-section">
          <p className="location-info">
            Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
          <button onClick={handleRefreshLocation} className="refresh-btn">
            Refresh Location
          </button>
        </div>
      )}
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            name={`${card.name} (${card.distance} km away)`}
            age={card.age}
            interests={card.interests}
            pronouns={card.pronouns}
            role={card.role}
          />
        ))}
      </div>
    </div>
  );
};

export default Geolocation;