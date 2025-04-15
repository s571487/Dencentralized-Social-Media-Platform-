import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PostFeed from "./PostFeed";
import Profile from "./Profile";
import Home from "./Home";
import NewPost from "./NewPost";
import Chats from "./Chats";
import Validator from "./Validator";
import Friends from "./friends";

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
        return <Chats />;
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
    </div>
  );
};

export default Layout;
