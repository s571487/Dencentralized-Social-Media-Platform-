import React, { useState } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  name: string;
  profilePicture: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

const Chats: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock data for users and messages
  const users: User[] = [
    { id: '1', name: 'Alice', profilePicture: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Bob', profilePicture: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Charlie', profilePicture: 'https://via.placeholder.com/150' },
  ];

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Fetch messages for the selected user (mock data for now)
    setMessages([
      { id: '1', senderId: '1', text: 'Hey!', timestamp: '10:00 AM' },
      { id: '2', senderId: '2', text: 'Hello!', timestamp: '10:05 AM' },
    ]);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for User List */}
      <div className={`w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
        </div>
        <div className="overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-3 text-gray-900 dark:text-white">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className={`flex-1 flex flex-col ${selectedUser ? 'block' : 'hidden md:block'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <button onClick={handleBackClick} className="md:hidden mr-4 text-gray-600 dark:text-gray-400">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                {selectedUser.name}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${message.senderId === selectedUser.id ? 'text-left' : 'text-right'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.senderId === selectedUser.id
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button className="ml-4 p-2 bg-indigo-500 rounded-full text-white hover:bg-indigo-600">
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            {/* Placeholder when no user is selected */}
            <p className="text-gray-500 dark:text-gray-400">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
