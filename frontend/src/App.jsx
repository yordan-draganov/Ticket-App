import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx';
import React from "react"
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Checkout from './components/Checkout.jsx'
import Home from './components/Home.jsx'
import EventDetails from './components/EventDetails.jsx'
import MyTickets from './components/MyTickets.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
    <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route
          path="/checkout"
          element={isLoggedIn ? <Checkout /> : <Navigate to="/login" replace />}
        />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>
    </main>
    </>
  );
}

export default App