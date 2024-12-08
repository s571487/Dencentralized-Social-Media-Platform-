import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConnectWalletPage from './pages/ConnectWalletPage';
import HomePage from './pages/HomePage';
import NewPost from './pages/NewPost';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectWalletPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/newpost" element={<NewPost />} />
    </Routes>
  );
}

export default App;
