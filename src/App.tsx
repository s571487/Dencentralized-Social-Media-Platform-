import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConnectWalletPage from './pages/ConnectWalletPage';
import HomePage from './pages/HomePage';
import NewPost from './pages/NewPost';

function App() {
  return (
    // Define application routes using React Router
    <Routes>
      {/* Route for the Connect Wallet page, accessible at the root path ("/") */}
      <Route path="/" element={<ConnectWalletPage />} />

      {/* Route for the Home page, accessible at the "/home" path */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/newpost" element={<NewPost />} />
    </Routes>
  );
}

export default App; // Exporting the App component as the default export

