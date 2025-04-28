// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import Sidebar from "./Sidebar";
// import PostFeed from "./PostFeed";
// import Profile from "./Profile";
// import Home from "./Home";
// import NewPost from "./NewPost";
// import Chats from "./Chats";
// import Validator from "./Validator";
// import Friends from "./friends";

// interface LayoutProps {
//   userAddress: string;
//   createNewWallet: (key: string) => Promise<void>;
//   getWalletData: (
//     key: string
//   ) => Promise<{ desocialAddress: string; desocialPrivateKey: string }>;
//   isDarkMode: boolean;
//   toggleDarkMode: () => void;
// }

// const Layout: React.FC<LayoutProps> = ({
//   userAddress,
//   createNewWallet,
//   getWalletData,
//   isDarkMode,
//   toggleDarkMode,
// }) => {
//   const [selectedOption, setSelectedOption] = useState("Home");

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   const renderContent = () => {
//     switch (selectedOption) {
//       case "Home":
//         return <Home />;
//       case "New Post":
//         return <NewPost />;
//       case "Chats":
//         return <Chats />;
//       case "Validator":
//         return <Validator />;
//       case "Profile":
//         return <Profile userAddress={userAddress} />;
//       case "Friends":
//         return <Friends userAddress={userAddress} isDarkMode={isDarkMode} />;
//       default:
//         return <PostFeed />;
//     }
//   };

//   return (
//     <div
//       className={`min-h-screen ${
//         isDarkMode ? "dark" : ""
//       } bg-[#f8fafc] dark:bg-[#1a1a1a]`}
//     >
//       <Header
//         userAddress={userAddress}
//         isDarkMode={isDarkMode}
//         toggleDarkMode={toggleDarkMode}
//       />
//       <div className="flex">
//         <Sidebar
//           selectedOption={selectedOption}
//           setSelectedOption={setSelectedOption}
//           isDarkMode={isDarkMode}
//         />
//         <main className="flex-1 ml-64 mt-16 min-h-[calc(100vh-4rem)] p-6 bg-[#f8fafc] dark:bg-[#1a1a1a]">
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PostFeed from "./PostFeed";
import Profile from "./Profile";
import Home from "./Home";
import NewPost from "./NewPost";
import Chats from "./Chats";
import Validator from "./Validator";
import Friends from "./friends";
import {
  getFriends,
  getMessages,
  getContract,
  fetchUserData,
} from "../contracts/contractInteractions";

interface LayoutProps {
  userAddress: string;
  createNewWallet: (key: string) => Promise<void>;
  getWalletData: (
    key: string
  ) => Promise<{ desocialAddress: string; desocialPrivateKey: string }>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  userAddress,
  createNewWallet,
  getWalletData,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [selectedOption, setSelectedOption] = useState("Home");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [friends, setFriends] = useState<string[]>([]);
  const [preselectedUser, setPreselectedUser] = useState<string | undefined>(
    undefined
  );

  // Initialize provider, fetch friends, and set up event listener
  useEffect(() => {
    let contract: any;
    const initialize = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const friendsList = await getFriends(provider, userAddress);
          console.log(
            "Layout: Fetched friends for",
            userAddress,
            ":",
            friendsList
          );
          setFriends(friendsList.map((addr: string) => addr.toLowerCase())); // Normalize addresses
          const { encryptedPrivateKey } = await fetchUserData(
            provider,
            userAddress
          );
          const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
          contract = getContract(wallet);

          // Listen for MessageSent events
          contract.on(
            "MessageSent",
            (from: string, to: string, text: string) => {
              if (to.toLowerCase() === userAddress.toLowerCase()) {
                const notificationId = `${from}-${Date.now()}`;
                const senderDisplay = `${from.slice(0, 6)}...${from.slice(-4)}`;
                toast.info(
                  <div>
                    <strong>New Message from {senderDisplay}</strong>
                    <p>{text}</p>
                  </div>,
                  {
                    toastId: notificationId,
                    onClick: () => {
                      console.log("Layout: Toast clicked for sender:", from);
                      setSelectedOption("Chats");
                      setPreselectedUser(from.toLowerCase());
                    },
                    autoClose: 5000,
                    closeOnClick: false,
                  }
                );
              }
            }
          );
        } catch (error) {
          console.error(
            "Layout: Error initializing provider or fetching friends:",
            error
          );
          toast.error("Failed to initialize provider or fetch friends");
        }
      } else {
        console.error("Layout: MetaMask not detected");
        toast.error("MetaMask not detected");
      }
    };
    initialize();

    // Clean up event listener on component unmount
    return () => {
      if (contract) {
        contract.off("MessageSent");
      }
    };
  }, [userAddress]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (selectedOption) {
      case "Home":
        return <Home />;
      case "New Post":
        return <NewPost />;
      case "Chats":
        return <Chats preselectedUser={preselectedUser} />;
      case "Validator":
        return <Validator />;
      case "Profile":
        return <Profile userAddress={userAddress} />;
      case "Friends":
        return <Friends userAddress={userAddress} isDarkMode={isDarkMode} />;
      default:
        return <PostFeed />;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark" : ""
      } bg-[#f8fafc] dark:bg-[#1a1a1a]`}
    >
      <Header
        userAddress={userAddress}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="flex">
        <Sidebar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          isDarkMode={isDarkMode}
        />
        <main className="flex-1 ml-64 mt-16 min-h-[calc(100vh-4rem)] p-6 bg-[#f8fafc] dark:bg-[#1a1a1a]">
          {renderContent()}
        </main>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default Layout;