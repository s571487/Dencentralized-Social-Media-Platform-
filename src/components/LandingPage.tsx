import React from 'react';
import logo from '../assets/Desocial-logo.png';

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        {/* Logo Section */}
        <img src={logo} alt="DeSocial Logo" className="w-30 h-30 mx-auto" />

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          DeSocial
        </h1>

        {/* Subtitle */}
        <p className="text-l text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          The next generation of social networking. Decentralized, secure, and built for the future.
        </p>

        {/* Connect Wallet Button */}
        <button
          onClick={onConnect}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg
                     hover:bg-indigo-700 dark:hover:bg-indigo-600 transform hover:scale-105 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2"
        >
          Connect Wallet to Begin
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
