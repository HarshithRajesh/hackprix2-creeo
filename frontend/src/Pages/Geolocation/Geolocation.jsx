import React, { useState, useEffect } from 'react';
import { Card } from '../../Components';
import { locationService } from '../../Service/api';
import './Geolocation.css';

const Geolocation = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [lastPosted, setLastPosted] = useState(0); // Track last successful post

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
            setError(`Geolocation error: ${err.message}`);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1000 * 60 * 5,
            timeout: 10000,
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    let intervalId;
    if (userLocation) {
      const userId = parseInt(localStorage.getItem('userid'));
      if (!userId || isNaN(userId)) {
        setError('User ID not found or invalid in local storage.');
        setLoading(false);
        return;
      }

      const postLocationData = async () => {
        const now = Date.now();
        // Skip if posted recently (within 5 seconds)
        if (now - lastPosted < 5000) {
          return;
        }

        try {
          const locationData = {
            id: userId,
            location: {
              lng: userLocation.lng,
              lat: userLocation.lat,
            },
          };
          console.log('Posting location:', locationData);
          await locationService.postLocation(locationData);
          console.log('Location posted successfully');
          setLastPosted(now); // Update last posted time
        } catch (error) {
          console.error('Error posting location:', error);
          setError(`Failed to post location: ${error.message}`);
        }
      };

      // Post location immediately and then every 5 seconds
      postLocationData();
      intervalId = setInterval(postLocationData, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [userLocation, lastPosted]);

useEffect(() => {
  const fetchNearbyPeople = async () => {
    try {
      const userId = parseInt(localStorage.getItem('userid'));
      if (!userId || isNaN(userId)) {
        setError('User ID not found or invalid in local storage.');
        setLoading(false);
        return;
      }

      // Ensure location is posted first
      await locationService.postLocation({
        id: userId,
        location: { lng: userLocation.lng, lat: userLocation.lat },
      });
      const data = await locationService.fetchNearbyPeople(userId);
      if (Array.isArray(data)) {
        setCards(
          data.map((person) => ({
            id: person.id,
            name: `${person.name} (${person.distance.toFixed(2)} km away)`,
            interests: person.interests || [],
          }))
        );
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Error fetching nearby people:', error);
      setError(`Failed to fetch nearby people: ${error.message}`);
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
          <p>
            Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
      {cards.length > 0 ? (
        <div className="cards-container">
          {cards.map((card) => (
            <Card key={card.id} name={card.name} interests={card.interests} />
          ))}
        </div>
      ) : (
        <p className="no-people-message">No people nearby.</p>
      )}
    </div>
  );
};

export default Geolocation;