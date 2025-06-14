import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Home,Chats,Geolocation,Menu,Profile} from './Pages'
import { Navbar } from './Components'
import './App.css'

function App() {

  return (
  <Router>
     
      <Routes>
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
