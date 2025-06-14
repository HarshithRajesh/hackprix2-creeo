import React, { useState } from 'react';
import './Chats.css';
import { ChatList, ChatWindow, MessageInput } from '../../Components';

const followers = [
  { id: 1, name: 'Ava Jones', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 2, name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 3, name: 'Emily Clark', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, name: 'Mike Brown', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

const initialChats = [
  { id: 1, userId: 1, name: 'Ava Jones', lastMessage: 'Hey there!', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: 2, userId: 2, name: 'John Smith', lastMessage: 'Yo!', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
];

const initialRequests = [
  { id: 3, userId: 3, name: 'Emily Clark', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, userId: 4, name: 'Mike Brown', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

const initialMessages = {
  1: [
    { id: 1, text: 'Hey there!', sender: 'them', timestamp: '2024-06-01 10:00' },
    { id: 2, text: 'Hello! How are you?', sender: 'me', timestamp: '2024-06-01 10:01' },
  ],
  2: [
    { id: 1, text: 'Yo!', sender: 'them', timestamp: '2024-06-01 09:00' },
    { id: 2, text: 'Hey John!', sender: 'me', timestamp: '2024-06-01 09:01' },
  ],
  3: [
    { id: 1, text: 'Hi!', sender: 'them', timestamp: '2024-06-01 08:00' },
    { id: 2, text: 'Hey Emily!', sender: 'me', timestamp: '2024-06-01 08:01' },
  ],
  4: [
    { id: 1, text: 'Hello!', sender: 'them', timestamp: '2024-06-01 07:00' },
    { id: 2, text: 'Hey Mike!', sender: 'me', timestamp: '2024-06-01 07:01' },
  ],
};

const Chats = () => {
  const [chats, setChats] = useState(initialChats);
  const [requests, setRequests] = useState(initialRequests);
  const [selectedChatId, setSelectedChatId] = useState(chats[0].id);
  const [messages, setMessages] = useState(initialMessages);
  const [notifications, setNotifications] = useState(2); // hardcoded
  const [activeTab, setActiveTab] = useState('inbox');

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const chatMessages = messages[selectedChatId] || [];

  const handleSend = (msg) => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [
        ...(prev[selectedChatId] || []),
        { id: (prev[selectedChatId]?.length || 0) + 1, text: msg, sender: 'me', timestamp },
      ],
    }));
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedChatId]: [
          ...(prev[selectedChatId] || []),
          { id: (prev[selectedChatId]?.length || 0) + 2, text: 'This is a hardcoded reply!', sender: 'them', timestamp },
        ],
      }));
    }, 1000);
  };

  const handleAcceptRequest = (requestId) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;
    setRequests(requests.filter(r => r.id !== requestId));
    setChats([...chats, { ...req, lastMessage: 'Say hi!', avatar: req.avatar }]);
    setMessages({
      ...messages,
      [req.id]: [
        { id: 1, text: 'Say hi!', sender: 'them', timestamp: '2024-06-01 12:00' },
      ],
    });
    setActiveTab('inbox');
    setSelectedChatId(req.id);
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="chat-page-container">
      <div className="chat-list-section">
        <ChatList
          followers={followers}
          chats={chats}
          requests={requests}
          notifications={notifications}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onAcceptRequest={handleAcceptRequest}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
      </div>
      <div className="chat-window-section">
        <ChatWindow
          messages={chatMessages}
          user={selectedChat}
        />
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chats;