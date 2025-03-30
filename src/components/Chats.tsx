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
  const [newMessage, setNewMessage] = useState('');

  const users: User[] = [
    { id: '1', name: 'Alice', profilePicture: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg' },
    { id: '2', name: 'Bob', profilePicture: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg' },
    { id: '3', name: 'Charlie', profilePicture: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg' },
  ];

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setMessages([
      { id: '1', senderId: user.id, text: 'Hey!', timestamp: '10:00 AM' },
      { id: '2', senderId: 'me', text: 'Hello!', timestamp: '10:05 AM' },
    ]);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedUser) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
    
    setTimeout(() => {
      const reply: Message = {
        id: Date.now().toString(),
        senderId: selectedUser.id,
        text: 'Got it!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className={`w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 ${selectedUser ? 'hidden md:block' : 'block'}`}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-serif">Chats</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200" onClick={() => handleUserClick(user)}>
              <img src={user.profilePicture} alt={user.name} className="w-12 h-12 rounded-full border-2 border-indigo-500 dark:border-indigo-400" />
              <span className="ml-4 text-lg font-medium text-gray-900 dark:text-white font-sans">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`flex-1 flex flex-col ${selectedUser ? 'block' : 'hidden md:block'}`}>
        {selectedUser ? (
          <>
            <div className="p-6 flex items-center border-b bg-white dark:bg-gray-800 shadow-sm">
              <button onClick={handleBackClick} className="md:hidden mr-4 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <img src={selectedUser.profilePicture} alt={selectedUser.name} className="w-12 h-12 rounded-full border-2 border-indigo-500 dark:border-indigo-400" />
              <span className="ml-4 text-2xl font-bold text-gray-900 dark:text-white font-serif">{selectedUser.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === selectedUser.id ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-4 max-w-md rounded-xl shadow-lg ${message.senderId === selectedUser.id ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-indigo-500 text-white'}`}>
                    <p className="text-sm">{message.text}</p>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-white dark:bg-gray-800 shadow-md">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button onClick={handleSendMessage} className="ml-4 p-3 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 shadow-lg transition-all duration-200">
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 font-sans">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
