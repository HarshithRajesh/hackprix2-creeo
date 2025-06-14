import React from 'react';
import './Card.css';
import { FaFolder } from 'react-icons/fa'; // Make sure you have react-icons installed

const Card = ({ name, age, interests, pronouns, role }) => {
  return (
    <div className="card">
      <h2>{name}, <span className="age">{age}</span></h2>
      <div className="interests">
        {interests.map((interest, index) => (
          <span className="interest-tag" key={index}>{interest}</span>
        ))}
      </div>
      {pronouns && <div className="pronoun">{pronouns}</div>}
      {role && (
        <div className="role">
          <FaFolder className="role-icon" />
          {role}
        </div>
      )}
    </div>
  );
};

export default Card;
