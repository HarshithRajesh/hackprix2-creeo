import React, { useState, useEffect } from 'react';
import { Card } from '../../Components';
import { locationService } from '../../Service/api';
import './Geolocation.css';

const Geolocation = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 5, // 5 minutes cache
            timeout: 10000
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // Post user's location to server periodically
  useEffect(() => {
    let intervalId;
    
    const postLocation = async () => {
      if (!userLocation) return;
      
      try {
        const userId = parseInt(localStorage.getItem('userid'));
        if (!userId) return;

        await locationService.postLocation({
          id: userId,
          location: userLocation
        });
      } catch (error) {
        console.error('Error posting location:', error);
      }
    };

    if (userLocation) {
      postLocation(); // Post immediately
      intervalId = setInterval(postLocation, 10000); // Then every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userLocation]);

  // Fetch nearby people
  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const userId = parseInt(localStorage.getItem('userid'));
        if (!userId) {
          setError("User ID not found in local storage.");
          setLoading(false);
          return;
        }

        const people = await locationService.fetchNearbyPeople(userId);
        setCards(people.map(person => ({
          id: person.id,
          name: person.name,
          age: person.age || 25, // Default age if not provided
          interests: person.interests,
          distance: person.distance
        })));
      } catch (error) {
        console.error('Error fetching nearby people:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchNearby();
      const refreshInterval = setInterval(fetchNearby, 30000); // Refresh every 30 seconds
      return () => clearInterval(refreshInterval);
    }
  }, [userLocation]);

  if (loading) return <div className="geolocation-container">Loading...</div>;
  if (error) return <div className="geolocation-container">Error: {error}</div>;

  return (
    <div className="geolocation-container">
      <h1>Nearby People</h1>
      {userLocation && (
        <div className="location-info">
          Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}
      
      <div className="cards-container">
        {cards.length > 0 ? (
          cards.map(person => (
            <Card
              key={person.id}
              id={person.id}
              name={person.name}
              age={person.age}
              interests={person.interests}
              distance={person.distance}
            />
          ))
        ) : (
          <p className="no-people">No people nearby</p>
        )}
      </div>
    </div>
  );
};

export default Geolocation;