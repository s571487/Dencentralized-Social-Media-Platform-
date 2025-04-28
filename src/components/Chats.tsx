// import React, { useState, useEffect } from "react";
// import { MessageCircle, ArrowLeft } from "lucide-react";
// import { ethers } from "ethers";
// import {
//   getFriends,
//   sendMessage,
//   getMessages,
//   fetchUserData,
// } from "../contracts/contractInteractions";

// interface User {
//   id: string;
//   name: string;
//   profilePicture: string;
// }

// interface Message {
//   id: string;
//   senderId: string;
//   text: string;
//   timestamp: string;
// }

// const Chats: React.FC = () => {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [friends, setFriends] = useState<string[]>([]);
//   const [currentUser, setCurrentUser] = useState<string>("");
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

//   useEffect(() => {
//     const initialize = async () => {
//       if (window.ethereum) {
//         try {
//           const provider = new ethers.BrowserProvider(window.ethereum);
//           setProvider(provider);
//           const signer = await provider.getSigner();
//           const userAddress = await signer.getAddress();
//           setCurrentUser(userAddress);

//           const friendsList = await getFriends(provider, userAddress);
//           setFriends(friendsList);
//         } catch (error) {
//           console.error("Error initializing chat:", error);
//         }
//       }
//     };

//     initialize();
//   }, []);

//   useEffect(() => {
//     if (selectedUser && provider) {
//       const loadMessages = async () => {
//         try {
//           const blockchainMessages = await getMessages(
//             currentUser,
//             selectedUser.id
//           );

//           const formattedMessages = blockchainMessages.map((msg: any) => ({
//             id: msg.timestamp.toString(),
//             senderId: msg.sender,
//             text: msg.text,
//             timestamp: new Date(
//               Number(msg.timestamp) * 1000
//             ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//           }));

//           setMessages(formattedMessages);
//         } catch (error) {
//           console.error("Error loading messages:", error);
//         }
//       };

//       // Initial load
//       loadMessages();

//       // Set up polling interval
//       const intervalId = setInterval(loadMessages, 5000);

//       // Cleanup interval on unmount or when selectedUser changes
//       return () => clearInterval(intervalId);
//     }
//   }, [selectedUser, provider, currentUser]);

//   const handleUserClick = async (friendAddress: string) => {
//     setSelectedUser({
//       id: friendAddress,
//       name: friendAddress.slice(0, 6) + "..." + friendAddress.slice(-4),
//       profilePicture: `https://api.dicebear.com/9.x/bottts/svg?seed=${friendAddress}`,
//     });
//   };

//   const handleBackClick = () => {
//     setSelectedUser(null);
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "" || !selectedUser || !provider) return;

//     try {
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();

//       const { success, txHash } = await sendMessage(
//         userAddress,
//         selectedUser.id,
//         newMessage
//       );

//       if (success) {
//         const message: Message = {
//           id: Date.now().toString(),
//           senderId: currentUser,
//           text: newMessage,
//           timestamp: new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         };

//         setMessages((prev) => [...prev, message]);
//         setNewMessage("");
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       {/* Friends List - Sidebar */}
//       <div
//         className={`w-full md:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 md:p-6 ${
//           selectedUser ? "hidden md:block" : "block"
//         }`}
//       >
//         <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 font-serif">
//           Chats
//         </h2>
//         <div className="space-y-2 md:space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
//           {friends.map((friend) => (
//             <div
//               key={friend}
//               className="flex items-center p-3 md:p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
//               onClick={() => handleUserClick(friend)}
//             >
//               <img
//                 src={`https://api.dicebear.com/9.x/bottts/svg?seed=${friend}`}
//                 alt={friend}
//                 className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-indigo-500 dark:border-indigo-400"
//               />
//               <span className="ml-3 md:ml-4 text-base md:text-lg font-medium text-gray-900 dark:text-white font-sans">
//                 {friend.slice(0, 6)}...{friend.slice(-4)}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div
//         className={`flex-1 flex flex-col h-full ${
//           selectedUser ? "block" : "hidden md:block"
//         }`}
//       >
//         {selectedUser ? (
//           <>
//             {/* Chat Header - Fixed */}
//             <div className="p-4 md:p-6 flex items-center border-b bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 z-10">
//               <button
//                 onClick={handleBackClick}
//                 className="md:hidden mr-4 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
//               >
//                 <ArrowLeft className="h-6 w-6" />
//               </button>
//               <img
//                 src={selectedUser.profilePicture}
//                 alt={selectedUser.name}
//                 className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-indigo-500 dark:border-indigo-400"
//               />
//               <span className="ml-3 md:ml-4 text-xl md:text-2xl font-bold text-gray-900 dark:text-white font-serif">
//                 {selectedUser.name}
//               </span>
//             </div>

//             {/* Messages Container - Scrollable */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${
//                     message.senderId === selectedUser.id
//                       ? "justify-start"
//                       : "justify-end"
//                   }`}
//                 >
//                   <div
//                     className={`p-3 md:p-4 max-w-[80%] md:max-w-md rounded-xl shadow-lg ${
//                       message.senderId === selectedUser.id
//                         ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
//                         : "bg-indigo-500 text-white"
//                     }`}
//                   >
//                     <p className="text-sm md:text-base">{message.text}</p>
//                     <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       {message.timestamp}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input - Fixed */}
//             <div className="p-4 md:p-6 border-t bg-white dark:bg-gray-800 shadow-md flex-shrink-0 z-10">
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                   className="flex-1 bg-gray-100 dark:bg-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm md:text-base"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   className="ml-3 md:ml-4 p-2 md:p-3 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 shadow-lg transition-all duration-200"
//                 >
//                   <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-gray-500 dark:text-gray-400 font-sans text-center px-4">
//               Select a friend to start chatting
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chats;


import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { ethers } from "ethers";
import {
  getFriends,
  sendMessage,
  getMessages,
  fetchUserData,
} from "../contracts/contractInteractions";

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

interface ChatsProps {
  preselectedUser?: string;
}

const Chats: React.FC<ChatsProps> = ({ preselectedUser }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [friends, setFriends] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setCurrentUser(userAddress.toLowerCase());

          const friendsList = await getFriends(provider, userAddress);
          console.log("Chats: Fetched friends for", userAddress, ":", friendsList);
          const normalizedFriends = friendsList.map((addr: string) => addr.toLowerCase());
          setFriends(normalizedFriends);

          // Preselect user if provided
          if (preselectedUser && normalizedFriends.includes(preselectedUser.toLowerCase())) {
            console.log("Chats: Preselecting user:", preselectedUser);
            handleUserClick(preselectedUser);
          } else if (preselectedUser) {
            console.warn("Chats: Preselected user not in friends list:", preselectedUser);
          }
        } catch (error) {
          console.error("Chats: Error initializing chat:", error);
        }
      } else {
        console.error("Chats: MetaMask not detected");
      }
    };

    initialize();
  }, [preselectedUser]);

  useEffect(() => {
    if (selectedUser && provider) {
      const loadMessages = async () => {
        try {
          const blockchainMessages = await getMessages(
            currentUser,
            selectedUser.id
          );
          console.log("Chats: Loaded messages for", selectedUser.id, ":", blockchainMessages);

          const formattedMessages = blockchainMessages.map((msg: any) => ({
            id: msg.timestamp.toString(),
            senderId: msg.sender.toLowerCase(),
            text: msg.text,
            timestamp: new Date(
              Number(msg.timestamp) * 1000
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));

          setMessages(formattedMessages);
        } catch(error) {
          console.error("Chats: Error loading messages for", selectedUser.id, ":", error);
        }
      };

      // Initial load
      loadMessages();

      // Set up polling interval
      const intervalId = setInterval(loadMessages, 5000);

      // Cleanup interval on unmount or when selectedUser changes
      return () => clearInterval(intervalId);
    }
  }, [selectedUser, provider, currentUser]);

  const handleUserClick = async (friendAddress: string) => {
    console.log("Chats: Handling user click for", friendAddress);
    setSelectedUser({
      id: friendAddress.toLowerCase(),
      name: friendAddress.slice(0, 6) + "..." + friendAddress.slice(-4),
      profilePicture: `https://api.dicebear.com/9.x/bottts/svg?seed=${friendAddress}`,
    });
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser || !provider) {
      console.log("Chats: Cannot send message", {
        newMessage,
        selectedUser,
        provider,
      });
      return;
    }

    try {
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const { success, txHash } = await sendMessage(
        userAddress,
        selectedUser.id,
        newMessage
      );

      console.log("Chats: Send message result:", { success, txHash });

      if (success) {
        const message: Message = {
          id: Date.now().toString(),
          senderId: currentUser,
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Chats: Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Friends List - Sidebar */}
      <div
        className={`w-full md:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 md:p-6 ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 font-serif">
          Chats
        </h2>
        <div className="space-y-2 md:space-y-3 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {friends.map((friend) => (
            <div
              key={friend}
              className="flex items-center p-3 md:p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
              onClick={() => handleUserClick(friend)}
            >
              <img
                src={`https://api.dicebear.com/9.x/bottts/svg?seed=${friend}`}
                alt={friend}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-indigo-500 dark:border-indigo-400"
              />
              <span className="ml-3 md:ml-4 text-base md:text-lg font-medium text-gray-900 dark:text-white font-sans">
                {friend.slice(0, 6)}...{friend.slice(-4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col h-full ${
          selectedUser ? "block" : "hidden md:block"
        }`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header - Fixed */}
            <div className="p-4 md:p-6 flex items-center border-b bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 z-10">
              <button
                onClick={handleBackClick}
                className="md:hidden mr-4 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <img
                src={selectedUser.profilePicture}
                alt={selectedUser.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-indigo-500 dark:border-indigo-400"
              />
              <span className="ml-3 md:ml-4 text-xl md:text-2xl font-bold text-gray-900 dark:text-white font-serif">
                {selectedUser.name}
              </span>
            </div>

            {/* Messages Container - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId.toLowerCase() === selectedUser.id.toLowerCase()
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 md:p-4 max-w-[80%] md:max-w-md rounded-xl shadow-lg ${
                      message.senderId.toLowerCase() === selectedUser.id.toLowerCase()
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "bg-indigo-500 text-white"
                    }`}
                  >
                    <p className="text-sm md:text-base">{message.text}</p>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input - Fixed */}
            <div className="p-4 md:p-6 border-t bg-white dark:bg-gray-800 shadow-md flex-shrink-0 z-10">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm md:text-base"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-3 md:ml-4 p-2 md:p-3 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 shadow-lg transition-all duration-200"
                >
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 font-sans text-center px-4">
              Select a friend to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;