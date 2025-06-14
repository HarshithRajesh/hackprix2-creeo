// Card.jsx
import React from 'react';
import './Card.css'; // Assuming you'll add this CSS later

const Card = ({ id, name, interests }) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>ID: {id}</p>
      <div className="interests">
        <h3>Interests:</h3>
        <ul>
          {interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
