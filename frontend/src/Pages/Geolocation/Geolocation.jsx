import React, { useState, useEffect } from 'react';
import { Card } from '../../Components';
import { locationService } from '../../Service/api'; // Import the location service
import './Geolocation.css';

const Geolocation = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            console.log('User location:', location);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 5,
            timeout: 10000,
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    let intervalId;
    if (userLocation) {
      const userId = parseInt(localStorage.getItem('userid')); // Retrieve user ID from local storage
      if (!userId) {
        setError("User ID not found in local storage.");
        setLoading(false);
        return;
      }

      const postLocationData = async () => {
        try {
          const locationData = {
            id: userId,
            location: {
              lng: userLocation.lng,
              lat: userLocation.lat,
            },
          };
          console.log(locationData)
          await locationService.postLocation(locationData);
          console.log('Location posted successfully');
        } catch (error) {
          console.error('Error posting location:', error);
        }
      };

      // Post location immediately and then every 10 seconds
      postLocationData();
      intervalId = setInterval(postLocationData, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [userLocation]);

  useEffect(() => {
    const fetchNearbyPeople = async () => {
      try {
        const userId = localStorage.getItem('userid'); 
        if (!userId) {
          setError("User ID not found in local storage.");
          setLoading(false);
          return;
        }

        const data = await locationService.fetchNearbyPeople(userId);
        setCards(data.map(person => ({
          id: person.id,
          name: `${person.name} (${person.distance.toFixed(2)} km away)`,
          interests: person.interests,
        })));
} catch (error) {
  console.error('Error fetching nearby people:', error);
  setError(error.message);
} finally {
  setLoading(false);
}
    };

if (userLocation) {
  fetchNearbyPeople();
}
  }, [userLocation]);

if (loading) return <div className="geolocation-container">Loading your location...</div>;
if (error) return <div className="geolocation-container">Error: {error}</div>;

return (
  <div className="geolocation-container">
    <h1>Nearby People</h1>
    {userLocation && (
      <div className="location-info">
        <p>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
      </div>
    )}
    {cards.length > 0 ? (
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            name={card.name}
            interests={card.interests}
          />
        ))}
      </div>
    ) : (
      <p className="no-people-message">No people nearby.</p>
    )}
  </div>
);
};

export default Geolocation;