import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const Card = ({ 
  id,
  name,
  age,
  interests,
  distance 
}) => {
  const navigate = useNavigate();

  // Format distance with appropriate units
  const formattedDistance = distance < 1 
    ? `${(distance * 1000).toFixed(0)}m` 
    : `${distance.toFixed(1)}km`;

  // Handle card click to navigate to profile
  const handleClick = () => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <h2 className="card-name">{name}</h2>
      
      <div className="card-details">
        <div className="detail-item">
          <FaUser className="detail-icon" />
          <span>{age} years</span>
        </div>
        <div className="detail-item">
          <FaMapMarkerAlt className="detail-icon" />
          <span>{formattedDistance} away</span>
        </div>
      </div>

      <div className="interests-container">
        <div className="interests">
          {interests.map((interest, index) => (
            <span className="interest-tag" key={`${id}-${index}`}>
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;