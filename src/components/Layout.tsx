import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PostFeed from './PostFeed';
import Profile from './Profile';
import Home from './Home';
import NewPost from './NewPost';
import Chats from './Chats';
import Validator from './Validator';

interface LayoutProps {
  userAddress: string;
  createNewWallet: (key: string) => Promise<void>;
  getWalletData: (key: string) => Promise<{ desocialAddress: string; desocialPrivateKey: string }>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userAddress, createNewWallet, getWalletData, isDarkMode, toggleDarkMode }) => {
  const [selectedOption, setSelectedOption] = useState('Home');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (selectedOption) {
      case 'Home':
        return <Home />;
      case 'New Post':
        return <NewPost />;
      case 'Chats':
        return <Chats />;
      case 'Validator':
        return <Validator />;
      case 'Profile':
        return <Profile userAddress={userAddress} getWalletData={getWalletData} />;
      default:
        return <PostFeed />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:bg-gray-900`}>
      <Header userAddress={userAddress} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex max-w-7xl mx-auto pt-16">
        <Sidebar setSelectedOption={setSelectedOption} />
        <main className="flex-1 px-4 py-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;