import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Registration/Login';
import Signup from './Components/Registration/Signup';
import Home from './Components/Home/Home';
import Stores from './Components/Stores/Stores';
import About from './Components/About/About';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    console.log("You are logged out");
  }

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
        <Routes>
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}></Route>
          <Route path='/signup' element={<Signup setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/stores' element={<Stores />}></Route>
          <Route path='/about' element={<About />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
