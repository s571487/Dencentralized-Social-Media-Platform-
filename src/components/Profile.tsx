import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";

interface ProfileProps {
  userAddress: string;
}

const contractAddress = "0x4aF6DE7c9976C4415c4C6cb48301337C6CCF4d95";
const contractABI = [
  "function getUserData(address user) view returns (string, string)",
];

const Profile: React.FC<ProfileProps> = ({ userAddress }) => {
  const [desocialAddress, setDeSocialAddress] = useState("");
  const [desocialPrivateKey, setDeSocialPrivateKey] = useState("");

  // Function to derive key and IV from userAddress
  const deriveKeyAndIV = (useraddress) => {
    const hash = CryptoJS.SHA256(useraddress);
    const key = CryptoJS.enc.Hex.parse(hash.toString().substring(0, 64)); // First 32 bytes for the key
    const iv = CryptoJS.enc.Hex.parse(hash.toString().substring(64, 96)); // Next 16 bytes for the IV
    return { key, iv };
  };

  const decryptData = (encryptedText) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      try {
        const [encryptedAddress, encryptedPrivateKey] = await contract.getUserData(userAddress);
        console.log("Encrypted Address:", encryptedAddress);
        console.log("Encrypted Private Key:", encryptedPrivateKey);

        setDeSocialAddress(encryptedAddress);
        setDeSocialPrivateKey(encryptedPrivateKey);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userAddress) {
      fetchUserData();
    }
  }, [userAddress]);

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
      </div>
    </div>
  );
};

export default Profile;