import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, user }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chatwindow-container">
      <div className="chatwindow-header">
        <img src={user.avatar} alt={user.name} className="chatwindow-avatar" />
        <div className="chatwindow-userinfo">
          <span className="chatwindow-username">{user.name}</span>
          {/* You can add more user info here if needed */}
        </div>
      </div>
      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className={`message-row ${msg.sender === 'me' ? 'sent' : 'received'}`}> 
            <div className={`message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>{msg.text}</div>
            <div className="message-meta">{msg.timestamp}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow; 