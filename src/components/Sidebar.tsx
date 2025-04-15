import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  PlusSquare,
  MessageSquare,
  Shield,
  User,
  Users,
} from "lucide-react";

interface SidebarProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedOption,
  setSelectedOption,
  isDarkMode,
}) => {
  const menuItems = [
    { icon: Home, label: "Home" },
    { icon: PlusSquare, label: "New Post" },
    { icon: MessageSquare, label: "Chats" },
    { icon: Users, label: "Friends" },
    { icon: Shield, label: "Validator" },
    { icon: User, label: "Profile" },
  ];

  return (
    <aside
      className={`w-64 h-[calc(100vh-4rem)] fixed left-0 top-16 border-r ${
        isDarkMode ? "bg-[#1a1a1a] border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <motion.nav
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2 p-4"
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
                  ? "bg-blue-600 text-white shadow-md" // Active state
                  : `${
                      isDarkMode
                        ? "text-gray-300 hover:bg-[#2a2a2a] hover:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
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
