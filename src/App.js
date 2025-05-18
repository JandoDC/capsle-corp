// src/App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import HomePage from './components/HomePage';
import GamePage from './components/GamePage'; // Your GamePage component

function App() {
  const location = useLocation(); // Get the current location object

  return (
    // AnimatePresence handles enter and exit animations for its direct children
    // mode="wait" ensures the exiting page finishes its animation before the new one enters
    <AnimatePresence mode="wait">
      {/*
        The key={location.pathname} on Routes is crucial.
        It tells AnimatePresence that when the pathname changes,
        the old Routes instance (and its child Route/element) is being replaced,
        triggering exit/enter animations.
      */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        {/* You can add other routes here later */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
