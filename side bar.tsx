import React from 'react';
import { motion } from 'framer-motion';
import { Home, PlusSquare, MessageSquare, Shield, User } from 'lucide-react';
 
const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: PlusSquare, label: 'New Post' },
    { icon: MessageSquare, label: 'Chats' },
    { icon: Shield, label: 'Validator' },
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
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg
                     hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md transition-all duration-200
                     text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
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