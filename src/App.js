// src/App.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage'; // Your GamePage component that fetches API data

function App() {
  const location = useLocation(); // Good to keep for ensuring components re-render on path change

  return (
    // The key on Routes ensures that when the path changes, React treats it as a new instance,
    // causing the old component to unmount and the new one to mount.
    // HomePage will handle its own exit animation before navigation.
    // GamePage will handle its own enter animation (if any) or just appear.
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} /> {/* No setPageRef needed from App.js */}
      <Route path="/game" element={<GamePage />} /> {/* No setPageRef needed from App.js */}
    </Routes>
  );
}

export default App;
