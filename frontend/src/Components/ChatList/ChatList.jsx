import React from 'react';
import './ChatList.css';

const ChatList = ({
  followers,
  chats,
  requests,
  notifications,
  selectedChatId,
  onSelectChat,
  onAcceptRequest,
  onTabChange,
  activeTab
}) => (
  <div className="chatlist-container">
    <div className="chatlist-tabs">
      <button className={activeTab === 'inbox' ? 'active' : ''} onClick={() => onTabChange('inbox')}>Inbox</button>
      <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => onTabChange('requests')}>Requests {requests.length > 0 && <span className="request-count">{requests.length}</span>}</button>
      <div className="notification-icon">
        <i className="bi bi-bell"></i>
        {notifications > 0 && <span className="notification-count">{notifications}</span>}
      </div>
    </div>
    <div className="followers-slider">
      {followers.map(f => (
        <div className="follower-slide" key={f.id}>
          <img src={f.avatar} alt={f.name} className="avatar" />
          <span>{f.name}</span>
        </div>
      ))}
    </div>
    {activeTab === 'inbox' && (
      <div className="chats-section">
        <h4>Chats ({chats.length})</h4>
        <div className="chats-list">
          {chats.map(c => (
            <div
              className={`chat-item${selectedChatId === c.id ? ' selected' : ''}`}
              key={c.id}
              onClick={() => onSelectChat(c.id)}
              style={{ cursor: 'pointer' }}
            >
              <img src={c.avatar} alt={c.name} className="avatar" />
              <div>
                <span>{c.name}</span>
                <p>{c.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    {activeTab === 'requests' && (
      <div className="requests-section">
        <h4>Requests ({requests.length})</h4>
        <div className="requests-list">
          {requests.map(r => (
            <div className="request-item" key={r.id}>
              <img src={r.avatar} alt={r.name} className="avatar" />
              <span>{r.name}</span>
              <button className="accept-btn" onClick={() => onAcceptRequest(r.id)}>Accept</button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ChatList; 