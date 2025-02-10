import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Users, ShieldCheck, Globe, MessageSquare, Code, ThumbsUp } from "lucide-react";

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform duration-200"
        >
          {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-900" />}
        </button>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
          DeSocial
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          The next generation of social networking. Decentralized, secure, and built for the future.
        </p>
        <motion.button
          onClick={onConnect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg
                     hover:bg-indigo-700 dark:hover:bg-indigo-600 transform transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2"
        >
          Connect Wallet to Begin
        </motion.button>
      </motion.div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Users className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Community Driven</h3>
          <p className="text-gray-600 dark:text-gray-300">Built by users, for users.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <ShieldCheck className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Secure & Private</h3>
          <p className="text-gray-600 dark:text-gray-300">Your data, your control.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Globe className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Truly Decentralized</h3>
          <p className="text-gray-600 dark:text-gray-300">No central authority.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <MessageSquare className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Encrypted Messaging</h3>
          <p className="text-gray-600 dark:text-gray-300">Secure and private chats.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <Code className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Open Source</h3>
          <p className="text-gray-600 dark:text-gray-300">Transparent and community-driven development.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <ThumbsUp className="w-12 h-12 mx-auto text-indigo-600 dark:text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Censorship Resistant</h3>
          <p className="text-gray-600 dark:text-gray-300">Freedom of expression, no central authority.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;