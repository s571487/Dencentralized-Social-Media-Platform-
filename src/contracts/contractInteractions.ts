import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { pinata } from "./utils/config";
import { Log } from "ethers";

export const contractAddress = "0x510E5a5A70d722525d0B190DbCe5EA6a60cb75B9";
export const contractABI = [
    "function setUserData(string memory _encryptedAddress, string memory _encryptedPrivateKey)",
    "function getUserData(address user) view returns (string, string)",
    "function isUserExists(address user) view returns (bool)",
    "function createPost(string memory description, string[] memory hashtags, string memory mediaHash, string memory cid)",
    "function likePost(uint256 postId)",
    "function addComment(uint256 postId, string memory text)",
    "function sendFriendRequest(address to)",
    "function acceptFriendRequest(address from)",
    "function getFriends(address user) view returns (address[] memory)",
    "function getFriendRequests(address user) view returns (tuple(address from, address to, bool accepted)[] memory)",
    "function getPostComments(uint256 postId) view returns (tuple(uint256 postId, address commenter, string text)[] memory)",
    "function getTotalPosts() view returns (uint256)",
    "function getAllPosts() view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes)[] memory)",
    "function getUserPosts(address user) view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes)[] memory)",
    "function postLikes(uint256, address) view returns (bool)",
    "function getUserFriends(address user) view returns (address[] memory)",
    // Add other necessary ABI functions here
  ];

export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(contractAddress, contractABI, providerOrSigner);
};

export const deriveKeyAndIV = (userAddress: string) => {
  const hash = CryptoJS.SHA256(userAddress);  
  const key = CryptoJS.enc.Hex.parse(hash.toString().substring(0, 64));
  const iv = CryptoJS.enc.Hex.parse(hash.toString().substring(64, 96));
  return { key, iv };
};


export const encryptData = (data: string, userAddress: string) => {
  const { key, iv } = deriveKeyAndIV(userAddress);
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
};

export const decryptData = (encryptedText: string, userAddress: string) => {
  const { key, iv } = deriveKeyAndIV(userAddress);
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const registerUser = async (signer: ethers.Signer, userAddress: string) => {
  const contract = getContract(signer);
  const wallet = ethers.Wallet.createRandom();
  const encryptedAddress = encryptData(wallet.address, userAddress);
  const encryptedPrivateKey = encryptData(wallet.privateKey, userAddress);
  await contract.setUserData(wallet.address, wallet.privateKey);
};

export const fetchUserData = async (provider: ethers.Provider, userAddress: string) => {
  const contract = getContract(provider);
  const [encryptedAddress, encryptedPrivateKey] = await contract.getUserData(userAddress);
  return { encryptedAddress, encryptedPrivateKey };
};  
  
export const checkUserExists = async (provider: ethers.Provider, userAddress: string) => {
  const contract = getContract(provider);
  return await contract.isUserExists(userAddress);
};

export const createPost = async (userAddress: string, description: string, hashtags: string[], mediaHash: string, cid: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log("User Address:", userAddress);
    
    // Fetch user data
    const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    
    console.log("DeSocial Address:", encryptedAddress);
    console.log("DeSocial Private Key:", encryptedPrivateKey);

    if (!encryptedPrivateKey) {
      throw new Error("DeSocial private key is empty.");
    }


    // Initialize wallet with the decrypted private key
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    // Create post
    await contract.createPost(description, hashtags, mediaHash, cid);
    console.log("Post created successfully.");
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

  

export const likePost = async (userAddress: string, postId: number) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
  const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
  const contract = getContract(wallet);
  await contract.likePost(postId);
};

export const addComment = async (userAddress: string, postId: number, text: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
  const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
  const contract = getContract(wallet);

  await contract.addComment(postId, text);
};

export const sendFriendRequest = async (userAddress: string, to: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
  const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
  const contract = getContract(wallet);

  await contract.sendFriendRequest(to);
};

export const acceptFriendRequest = async (userAddress: string, from: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
  const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
  const contract = getContract(wallet);

  await contract.acceptFriendRequest(from);
};

export const getFriends = async (userAddress: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = getContract(provider);
  return await contract.getFriends(userAddress);
};

export const getFriendRequests = async (userAddress: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
  const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
  const contract = getContract(provider);
  const userData = await contract.getFriendRequests(wallet.address);
  console.log("getFriendRequests userData", userData);
  return userData;
};

export const getBalance = async (provider: ethers.Provider, encryptedAddress: string) => {
    const balance = await provider.getBalance(encryptedAddress);
    return ethers.formatEther(balance);
  };

export const getTotalPosts = async (provider: ethers.Provider) => {
  const contract = getContract(provider);
  return await contract.getTotalPosts();
};

// Update getAllPosts and getPostComments functions
export const getAllPosts = async (provider: ethers.Provider) => {
    const contract = getContract(provider);
    const posts = await contract.getAllPosts();
    
    return posts.map((post: any) => ({
      id: post.id.toString(),
      user: post.user,
      description: post.description,
      mediaHash: post.mediaHash,
      likes: Number(post.likes),
      hashtags: post.hashtags,
      cid: post.cid
    }));
  };
  
  export const getPostComments = async (postId: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = getContract(provider);
    const comments = await contract.getPostComments(postId);
    
    return comments.map((comment: any) => ({
      commenter: comment.commenter,
      text: comment.text
    }));
  };
  
  export const getUserPosts = async (provider: ethers.Provider, userAddress: string) => {
    const contract = getContract(provider);
    const posts = await contract.getUserPosts(userAddress);
    return posts;
};

export const getUserFriends = async (provider: ethers.Provider, userAddress: string) => {
    const contract = getContract(provider);
    const friends = await contract.getUserFriends(userAddress);
    return friends;
};
