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
      const savedLocation = localStorage.getItem('location');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          setUserLocation(parsedLocation);
          simulateNearbyPeople(parsedLocation);
          return;
        } catch (e) {
          console.error('Failed to parse saved location', e);
        }
      }

      if (navigator.geolocation) {
        const timeoutId = setTimeout(() => {
          alert("Unable to retrieve your location within the expected time.");
          setLoading(false);
        }, 10000); // Timeout after 10 seconds

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId); // Clear the timeout if we successfully get the location
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString()
            };

            localStorage.setItem('location', JSON.stringify(location));
            setUserLocation(location);
            simulateNearbyPeople(location);
          },
          (err) => {
            clearTimeout(timeoutId); // Clear the timeout if there's an error
            setError(err.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 5, // 5 minutes
            timeout: 10000 // Match this with the setTimeout duration
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    const simulateNearbyPeople = (location) => {
  // Enhanced simulation data
  const simulatedPeople = [
    {
      id: 1,
      name: 'Alex Johnson',
      age: 28,
      pronouns: 'They/Them',
      role: 'Photographer',
      interests: ['Photography', 'Hiking', 'Music'],
      distance: 0.5 // km
    },
    {
      id: 2,
      name: 'Sam Wilson',
      age: 34,
      pronouns: 'He/Him',
      role: 'Chef',
      interests: ['Cooking', 'Travel', 'Reading'],
      distance: 1.2 // km
    },
    {
      id: 3,
      name: 'Taylor Smith',
      age: 23,
      pronouns: 'She/Her',
      role: 'Student',
      interests: ['Art', 'Technology', 'Cycling'],
      distance: 2.1 // km
    },
    {
      id: 4,
      name: 'Jordan Lee',
      age: 30,
      pronouns: 'He/Him',
      role: 'Software Engineer',
      interests: ['Coding', 'Gaming', 'Movies'],
      distance: 0.8 // km
    },
    {
      id: 5,
      name: 'Morgan Brown',
      age: 25,
      pronouns: 'They/Them',
      role: 'Graphic Designer',
      interests: ['Design', 'Music', 'Coffee'],
      distance: 3.0 // km
    }
  ];

  setCards(simulatedPeople.map(person => ({
    id: person.id,
    name: `${person.name}`,
    age: person.age,
    pronouns: person.pronouns,
    role: person.role,
    interests: person.interests
  })));
  setLoading(false);
};


    getLocation();
  }, []);

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
        </div>
      )}
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            name={`${card.name}`}
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
