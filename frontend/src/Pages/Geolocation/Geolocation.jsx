// Geolocation.jsx
import React, { useState, useEffect } from 'react';
import {Card} from '../../Components'; // Import the Card component
import './Geolocation.css'; // Assuming you'll add this CSS later

const Geolocation = () => {
  const [cards, setCards] = useState([]);

  // Dummy data
  const dummyData = [
    {
      id: 1,
      name: 'Varun',
      age: 24,
      pronouns: 'he/him',
      role: 'Software Engineer at DevCorp',
      interests: ['Hiking', 'Photography', 'Coding'],
    },
    {
      id: 2,
      name: 'Alice',
      age: 27,
      pronouns: 'she/her',
      role: 'UX Designer at Creatives',
      interests: ['Reading', 'Traveling', 'Cooking'],
    },
    {
      id: 3,
      name: 'Bob',
      age: 30,
      pronouns: 'he/him',
      role: 'Data Analyst at Insight Inc',
      interests: ['Fishing', 'Gaming', 'Music'],
    },
    {
      id: 4,
      name: 'Charlie',
      age: 26,
      pronouns: 'they/them',
      role: 'Product Manager at LaunchPad',
      interests: ['Cycling', 'Painting', 'Gardening', 'Writing'],
    },
  ];


  // Simulate fetching data from backend
  useEffect(() => {
    setCards(dummyData);
  }, []);

  return (
    <div className="geolocation-container">
      <h1>Nearby People</h1>
      <div className="cards-container">
        {cards.map((card) => (
          <Card
            key={card.id}
            name={card.name}
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
