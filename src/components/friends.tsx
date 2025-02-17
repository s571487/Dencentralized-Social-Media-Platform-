import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  return (
    <div className="p-6 w-full rounded-lg shadow-md bg-transparent">
      {/* Tabs */}
      <div className="flex justify-center space-x-6 border-b border-gray-300 dark:border-gray-700 pb-2">
        {['friends', 'requests'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'friends' | 'requests')}
            className={`relative px-6 py-3 text-lg font-semibold focus:outline-none transition-all duration-300
              ${
                activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300'
              }`}
          >
            {tab === 'friends' ? 'Friends' : 'Friend Requests'}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 dark:bg-indigo-400 rounded"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Your Friends</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">List of friends will appear here...</p>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Friend Requests</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Pending friend requests will appear here...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Friends;
