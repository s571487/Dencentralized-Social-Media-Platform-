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

  
};

export default Profile;