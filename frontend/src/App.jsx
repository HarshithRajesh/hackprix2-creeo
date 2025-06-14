import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home'
import { Navbar } from './Components'
import './App.css'

function App() {

  return (
  <Router>
     
      <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
        <Navbar />
    </Router>
 
  )
}

export default App
