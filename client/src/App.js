import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import SignUp from './pages/Signup.js';
import Login from './pages/Login.js';
import Userboard from './pages/Userboard.js';
import Dashboard from './pages/Dashboard.js';
import AddFriends from './pages/AddFriends.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/userboard/:username" element={<Userboard />}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-friends" element={<AddFriends />} />
      </Routes>
    </Router>
  )
}

export default App