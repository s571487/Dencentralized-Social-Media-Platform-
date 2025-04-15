import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { Sun, Moon } from "lucide-react";
import LandingPage from "./components/LandingPage";
import Layout from "./components/Layout";
import DeSocialABI from "./contracts/DeSocialABI.json"; // Import contract ABI

const CONTRACT_ADDRESS = "0x577b93176FF7c4a8355E601ba3ac971F0aaDE82f"; // Replace with your contract address

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [isDark, setIsDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, DeSocialABI, signer);
        setContract(contract);

        const accounts = await provider.send("eth_requestAccounts", []);
        setAddress(accounts[0]);
        setIsConnected(true);
        console.log("contract", contract);

        // Check if the user exists in the contract
        const userExists = await contract.isUserRegistered(accounts[0]);
        console.log("userExists", userExists);

        // Create a new wallet if the user does not exist
        if (!userExists) {
          await createNewWallet();
        }
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Function to derive key and IV from useraddress
  const deriveKeyAndIV = (useraddress) => {
    const hash = CryptoJS.SHA256(useraddress);
    const key = CryptoJS.enc.Hex.parse(hash.toString().substring(0, 64)); // First 32 bytes for the key
    const iv = CryptoJS.enc.Hex.parse(hash.toString().substring(64, 96)); // Next 16 bytes for the IV
    return { key, iv };
  };

  const { key, iv } = deriveKeyAndIV(address);

  const encryptData = (text) => {
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  };

  const decryptData = (encryptedText) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  // Function to create a new wallet, encrypt it, and store it on-chain
  const createNewWallet = async () => {
    try {
      // Generate a new Ethereum wallet
      const newWallet = ethers.Wallet.createRandom();
      const desocialAddress = newWallet.address;
      const desocialPrivateKey = newWallet.privateKey;
      console.log("desocialAddress", desocialAddress);
      console.log("desocialPrivateKey", desocialPrivateKey);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DeSocialABI, signer);

      // Send encrypted data to the smart contract
      const tx = await contract.aasetUserData(
        desocialAddress,
        desocialPrivateKey
      );
      await tx.wait();

      console.log("New wallet encrypted and stored on-chain.");
    } catch (error) {
      console.error("Error creating new wallet:", error);
    }
  };

  // Function to retrieve and decrypt wallet data from the smart contract
  const getWalletData = async () => {
    if (!contract || !address) return { desocialAddress: "", desocialPrivateKey: "" };

    try {
      // Fetch encrypted data from the contract
      const [encryptedAddress, encryptedPrivateKey] = await contract.getUserData(address);

      // Decrypt the data
      const desocialAddress = decryptData(encryptedAddress);
      const desocialPrivateKey = decryptData(encryptedPrivateKey);

      return { desocialAddress, desocialPrivateKey };
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return { desocialAddress: "", desocialPrivateKey: "" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>
      {!isConnected ? (
        <LandingPage onConnect={connectWallet} />
      ) : (
        <Layout
          userAddress={address}
          createNewWallet={createNewWallet}
          getWalletData={getWalletData}
          isDarkMode={isDark}
          toggleDarkMode={() => setIsDark(!isDark)}
        />
      )}
    </div>
  );
}

export default App;
