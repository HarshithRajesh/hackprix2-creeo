import React,{useEffect} from 'react';
import './Home.css';
import {FeedCard} from '../../Components'; 
import {healthService} from '../../Service/api'; 
const posts = [
  {
    user: 'Sally',
    date: 'Mar 20, 2025',
    time: '10:32 AM',
    text: 'It was great catching up with my bestie',
    likes: 20,
    comments: 3,
    images: [],
  },
  {
    user: 'Jena',
    date: 'Mar 25, 2025',
    time: '6:45 PM',
    text: 'Live with no excuses and travel with no regrets #travel #bali',
    likes: 55,
    comments: 8,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    ],
  },
  {
    user: 'Ravi',
    date: 'Mar 25, 2025',
    time: '6:45 PM',
    text: 'Live with no excuses and travel with no regrets #travel #bali',
    likes: 55,
    comments: 8,
    images: [
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
    ],
  },
];

const Home = () => {
  useEffect(() => {
    const checkHealth = async () => {
     try {
        const data = await healthService.checkHealth();
        console.log('Health check response:', data);
      } catch (error) {
        console.error('Error checking health:', error);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="chat-page">
      <h2 className="chat-title">CREEO</h2>
      <div className="chat-feed">
        {posts.map((post, idx) => (
          <FeedCard
            key={idx}
            user={post.user}
            date={post.date}
            time={post.time}
            text={post.text}
            images={post.images}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
