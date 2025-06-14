import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSend }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="messageinput-container">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput; 