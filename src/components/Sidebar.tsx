import React from 'react';
import { motion } from 'framer-motion';
import { Home, PlusSquare, MessageSquare, Shield, User, Users } from 'lucide-react';

interface SidebarProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedOption, setSelectedOption }) => {
  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: PlusSquare, label: 'New Post' },
    { icon: MessageSquare, label: 'Chats' },
    { icon: Shield, label: 'Validator' },
    { icon: Users, label: 'Friends' },
    { icon: User, label: 'Profile' },
  ];

  return (
    <aside className="w-64 pr-4">
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2 sticky top-20"
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedOption(item.label)}
            className={`flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-all duration-200
              ${
                selectedOption === item.label
                  ? 'bg-indigo-500 text-white dark:bg-indigo-600 shadow-md' // Active state
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </motion.nav>
    </aside>
  );
};

export default Sidebar;
