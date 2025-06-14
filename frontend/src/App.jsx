import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home,Chats,Geolocation,Menu,Profile,Auth,CreateProfile} from './Pages'
import { Navbar } from './Components'
import './App.css'
import Header from './Components/Header/Header';

function App() {

  return (
  <Router>
      <Header />

      <Routes>
            <Route path="/auth" element={<Auth/>} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/" element={<Home/>} />
            <Route path="/menu" element={<Menu/>} />
            <Route path="/chats" element={<Chats/>} />  
            <Route path="/profile" element={<Profile/>} />
            <Route path="/geolocation" element={<Geolocation/>} />
          </Routes>
        <Navbar />
    </Router>
 
  )
}

export default App
