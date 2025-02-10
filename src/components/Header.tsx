import React from 'react';
import { Search, LogOut, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  userAddress: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ userAddress, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          DeSocial
        </div>

        <div className="max-w-xl w-full mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100/80 dark:bg-gray-800/80 px-4 py-2 pl-10 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-gray-900 dark:text-gray-200">
            {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
          <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;