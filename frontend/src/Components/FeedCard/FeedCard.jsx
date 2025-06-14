import React, { useState } from 'react';
import './FeedCard.css';

const FeedCard = ({ user, date, time, text, images, likes, comments }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => (liked ? prev - 1 : prev + 1));
    };

    return (
        <div className="feed-card">
            <div className="feed-header">
                <span className="feed-user">{user}</span>
                <span className="feed-time">{time}</span>
            </div>
            <p className="feed-text">{text}</p>

            {images.length > 0 && (
                <div className="feed-slider">
                    {images.map((img, index) => (
                        <img key={index} src={img} alt={`slide-${index}`} />
                    ))}
                </div>
            )}


            <div className="feed-footer">
                <span onClick={toggleLike} className={`like-icon ${liked ? 'liked' : ''}`}>
                    <i className="fas fa-heart"></i> {likeCount}
                </span>
                <span><i className="fas fa-comment"></i> {comments}</span>
                <span>{date}</span>
            </div>
        </div>
    );
};

export default FeedCard;