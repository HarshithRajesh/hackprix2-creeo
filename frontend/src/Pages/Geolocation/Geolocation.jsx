// Geolocation.jsx
import React, { useState, useEffect } from 'react';
import Card from './Card'; // Import the Card component
import './Geolocation.css'; // Assuming you'll add this CSS later

const Geolocation = () => {
  const [cards, setCards] = useState([]);

  // Dummy data
  const dummyData = [
    { id: 1, name: 'Varun', interests: ['Hiking', 'Photography', 'Coding'] },
    { id: 2, name: 'Alice', interests: ['Reading', 'Traveling', 'Cooking'] },
    { id: 3, name: 'Bob', interests: ['Fishing', 'Gaming', 'Music'] },
    { id: 4, name: 'Charlie', interests: ['Cycling', 'Painting', 'Gardening'] },
  ];

  // Simulate fetching data from backend
  useEffect(() => {
    setCards(dummyData);
  }, []);

  return (
    <div className="geolocation-container">
      <h1>Geolocation</h1>
      <div className="cards-container">
        {cards.map((card) => (
          <Card key={card.id} id={card.id} name={card.name} interests={card.interests} />
        ))}
      </div>
    </div>
  );
};

export default Geolocation;
