import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { fetchUserData, getBalance } from "../contracts/contractInteractions";

interface ProfileProps {
  userAddress: string;
}

const Profile: React.FC<ProfileProps> = ({ userAddress }) => {
  const [desocialAddress, setDeSocialAddress] = useState("");
  const [desocialPrivateKey, setDeSocialPrivateKey] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        const {encryptedAddress,encryptedPrivateKey} = await fetchUserData(provider, userAddress);
        console.log("Profile encryptedAddress", encryptedPrivateKey);
        
        setDeSocialAddress(encryptedAddress);
        setDeSocialPrivateKey(encryptedPrivateKey);

        // Fetch initial balance
        updateBalance(provider, encryptedAddress);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const updateBalance = async (provider: ethers.Provider, address: string) => {
      try {
        const balance = await getBalance(provider, address);
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    if (userAddress) {
      fetchData();

      // Set up a polling mechanism to update the balance every 10 seconds
      const interval = setInterval(() => {
        if (desocialAddress) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          updateBalance(provider, desocialAddress);
        }
      }, 10000);

      // Clear the interval when the component unmounts or when userAddress changes
      return () => clearInterval(interval);
    }
  }, [userAddress, desocialAddress]);

  return (
    <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 dark:text-gray-400">Connected Address:</label>
          <input type="text" className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" value={userAddress} readOnly />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-400">DeSocial Address:</label>
          <input type="text" className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" value={desocialAddress} readOnly />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-400">DeSocial Private Key:</label>
          <input type="text" className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" value={desocialPrivateKey} readOnly />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-400">Balance (Base Sepolia):</label>
          <input type="text" className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" value={balance ? `${balance} ETH` : "Loading..."} readOnly />
        </div>
      </div>
    </div>
  );
};

export default Profile;
