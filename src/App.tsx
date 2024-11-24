import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConnectWalletPage from './pages/ConnectWalletPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectWalletPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
