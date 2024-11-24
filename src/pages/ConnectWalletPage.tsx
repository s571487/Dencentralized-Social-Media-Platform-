import React, { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "../assets/logo.png";
import { contractABI } from "../config"; // Make sure you import the ABI correctly

const ConnectWalletPage = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const navigate = useNavigate();


  // Contract Address (update with your contract's address)
  const contractAddress = "0x82714f94c5E7F1330cB9F51Ee918eC092E5928FA";

  // useEffect(() => {
  //   if (walletAddress && contract) {
  //     const checkAndCreateUser = async () => {
  //       try {
  //         // Get the signer from the provider
  //         const provider = new ethers.BrowserProvider(window.ethereum);
  //         const signer = await provider.getSigner();
          
  //         // Create a new contract instance with the signer
  //         const contractWithSigner = contract.connect(signer);
  
  //         // Check if the user exists in the contract
  //         console.log("Checking if user exists in the contract");
          
  //           console.log("Creating new user");
  //           const tx = await contractWithSigner.createUser();
  //           // Wait for the transaction to be mined
  //           await tx.wait();
  //           console.log("User created successfully");
          
          
  //         navigate("/home", { state: { walletAddress } });
  //       } catch (error) {
  //         console.error("Error interacting with contract:", error);
  //       }
  //     };
  
  //     checkAndCreateUser();
  //   }
  // }, [walletAddress, contract, navigate]);

  // // Handle wallet connection
  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       // Request wallet connection (MetaMask, etc.)
  //       const [account] = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });

  //       setWalletAddress(account);

  //       // Initialize the provider and contract
  //       const web3Provider = new ethers.BrowserProvider(window.ethereum);
  //       setProvider(web3Provider);

  //       const signer = new ethers.VoidSigner(contractAddress, provider);
  //       const userContract = new ethers.Contract(contractAddress, contractABI, signer);
  //       setContract(userContract);
  //     } catch (err) {
  //       console.error("Error connecting wallet:", err);
  //     }
  //   } else {
  //     console.error("Ethereum provider is not available");
  //   }
  // };

  // Handle wallet connection
const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request wallet connection
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(account);

      // Initialize the provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      // Get signer for the connected account
      const signer = await web3Provider.getSigner();
      
      // Initialize contract with signer
      const userContract = new ethers.Contract(
        contractAddress, 
        contractABI, 
        signer
      );
      
      setContract(userContract);
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  } else {
    console.error("Ethereum provider is not available");
  }
};

// Effect for checking and creating user
useEffect(() => {
  if (walletAddress && contract) {
    const checkAndCreateUser = async () => {
      try {
        console.log("Creating new user");
        const tx = await contract.createUser();
        console.log("Waiting for transaction confirmation...");
        await tx.wait();
        console.log("User created successfully");
        
        navigate("/home", { state: { walletAddress } });
      } catch (error: any) {
        console.error("Error interacting with contract:", error);
        if (error.code === 'ACTION_REJECTED') {
          console.log('User rejected the transaction');
        } else if (error.reason === 'User already exists') {
          console.log('User already exists, proceeding to home');
          navigate("/home", { state: { walletAddress } });
        }
      }
    };

    checkAndCreateUser();
  }
}, [walletAddress, contract, navigate]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
          <h1 style={{ fontSize: "18px", margin: 0 }}>DSMP</h1>
        </div>
        <div onClick={connectWallet}>
          <ConnectButton/>
        </div>
      </header>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <img
          src={Logo}
          alt="Centered Logo"
          style={{ width: "400px", height: "400px", marginBottom: "20px" }}
        />
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Connect Wallet for Access
        </h2>
      </main>
    </div>
  );
};

export default ConnectWalletPage;
