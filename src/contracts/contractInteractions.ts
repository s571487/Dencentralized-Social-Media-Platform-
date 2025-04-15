// import { ethers } from "ethers";
// import CryptoJS from "crypto-js";
// import { pinata } from "./utils/config";
// import { Log } from "ethers";

// export const contractAddress = "0x510E5a5A70d722525d0B190DbCe5EA6a60cb75B9";
// export const contractABI = [
//     "function setUserData(string memory _encryptedAddress, string memory _encryptedPrivateKey)",
//     "function getUserData(address user) view returns (string, string)",
//     "function isUserExists(address user) view returns (bool)",
//     "function createPost(string memory description, string[] memory hashtags, string memory mediaHash, string memory cid)",
//     "function likePost(uint256 postId)",
//     "function addComment(uint256 postId, string memory text)",
//     "function sendFriendRequest(address to)",
//     "function acceptFriendRequest(address from)",
//     "function getFriends(address user) view returns (address[] memory)",
//     "function getFriendRequests(address user) view returns (tuple(address from, address to, bool accepted)[] memory)",
//     "function getPostComments(uint256 postId) view returns (tuple(uint256 postId, address commenter, string text)[] memory)",
//     "function getTotalPosts() view returns (uint256)",
//     "function getAllPosts() view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes)[] memory)",
//     "function getUserPosts(address user) view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes)[] memory)",
//     "function postLikes(uint256, address) view returns (bool)",
//     "function getUserFriends(address user) view returns (address[] memory)",
//     // Add other necessary ABI functions here
//   ];

// export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
//   return new ethers.Contract(contractAddress, contractABI, providerOrSigner);
// };

// export const deriveKeyAndIV = (userAddress: string) => {
//   const hash = CryptoJS.SHA256(userAddress);
//   const key = CryptoJS.enc.Hex.parse(hash.toString().substring(0, 64));
//   const iv = CryptoJS.enc.Hex.parse(hash.toString().substring(64, 96));
//   return { key, iv };
// };

// export const encryptData = (data: string, userAddress: string) => {
//   const { key, iv } = deriveKeyAndIV(userAddress);
//   const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
//   return encrypted.toString();
// };

// export const = (encryptedText: sress: string) => {
//   const { key, iv } = deriveKeyAndIV(userAddress);
//   const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

// export const registerUser = async (signer: ethers.Signer, userAddress: string) => {
//   const contract = getContract(signer);
//   const wallet = ethers.Wallet.createRandom();
//   const encryptedAddress = encryptData(wallet.address, userAddress);
//   const encryptedPrivateKey = encryptData(wallet.privateKey, userAddress);
//   await contract.setUserData(wallet.address, wallet.privateKey);
// };

// export const fetchUserData = async (provider: ethers.Provider, userAddress: string) => {
//   const contract = getContract(provider);
//   const [encryptedAddress, encryptedPrivateKey] = await contract.getUserData(userAddress);
//   return { encryptedAddress, encryptedPrivateKey };
// };

// export const checkUserExists = async (provider: ethers.Provider, userAddress: string) => {
//   const contract = getContract(provider);
//   return await contract.isUserExists(userAddress);
// };

// export const createPost = async (userAddress: string, description: string, hashtags: string[], mediaHash: string, cid: string) => {
//   try {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     console.log("User Address:", userAddress);

//     // Fetch user data
//     const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);

//     console.log("DeSocial Address:", encryptedAddress);
//     console.log("DeSocial Private Key:", encryptedPrivateKey);

//     if (!encryptedPrivateKey) {
//       throw new Error("DeSocial private key is empty.");
//     }

//     // Initialize wallet with the decrypted private key
//     const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//     const contract = getContract(wallet);

//     // Create post
//     await contract.createPost(description, hashtags, mediaHash, cid);
//     console.log("Post created successfully.");
//   } catch (error) {
//     console.error("Error creating post:", error);
//   }
// };

// export const likePost = async (userAddress: string, postId: number) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
//   const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//   const contract = getContract(wallet);
//   await contract.likePost(postId);
// };

// export const addComment = async (userAddress: string, postId: number, text: string) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
//   const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//   const contract = getContract(wallet);

//   await contract.addComment(postId, text);
// };

// export const sendFriendRequest = async (userAddress: string, to: string) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
//   const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//   const contract = getContract(wallet);

//   await contract.sendFriendRequest(to);
// };

// export const acceptFriendRequest = async (userAddress: string, from: string) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
//   const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//   const contract = getContract(wallet);

//   await contract.acceptFriendRequest(from);
// };

// export const getFriends = async (userAddress: string) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const contract = getContract(provider);
//   return await contract.getFriends(userAddress);
// };

// export const getFriendRequests = async (userAddress: string) => {
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const { encryptedAddress, encryptedPrivateKey } = await fetchUserData(provider, userAddress);
//   const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//   const contract = getContract(provider);
//   const userData = await contract.getFriendRequests(wallet.address);
//   console.log("getFriendRequests userData", userData);
//   return userData;
// };

// export const getBalance = async (provider: ethers.Provider, encryptedAddress: string) => {
//     const balance = await provider.getBalance(encryptedAddress);
//     return ethers.formatEther(balance);
//   };

// export const getTotalPosts = async (provider: ethers.Provider) => {
//   const contract = getContract(provider);
//   return await contract.getTotalPosts();
// };

// // Update getAllPosts and getPostComments functions
// export const getAllPosts = async (provider: ethers.Provider) => {
//     const contract = getContract(provider);
//     const posts = await contract.getAllPosts();

//     return posts.map((post: any) => ({
//       id: post.id.toString(),
//       user: post.user,
//       description: post.description,
//       mediaHash: post.mediaHash,
//       likes: Number(post.likes),
//       hashtags: post.hashtags,
//       cid: post.cid
//     }));
//   };

//   export const getPostComments = async (postId: number) => {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const contract = getContract(provider);
//     const comments = await contract.getPostComments(postId);

//     return comments.map((comment: any) => ({
//       commenter: comment.commenter,
//       text: comment.text
//     }));
//   };

//   export const getUserPosts = async (provider: ethers.Provider, userAddress: string) => {
//     const contract = getContract(provider);
//     const posts = await contract.getUserPosts(userAddress);
//     return posts;
// };

// export const getUserFriends = async (provider: ethers.Provider, userAddress: string) => {
//     const contract = getContract(provider);
//     const friends = await contract.getUserFriends(userAddress);
//     return friends;
// };

//0x76f55c0165855566e02bd1491e43Fb65ce123847
// 0xc3beb08fbf829d067bcd40a20613231137a3ad12
import { ethers } from "ethers";
import CryptoJS from "crypto-js";

export const contractAddress = "0x577b93176FF7c4a8355E601ba3ac971F0aaDE82f";
export const contractABI = [
  // User functions
  "function aasetUserData(string memory _encryptedAddress, string memory _encryptedPrivateKey)",
  "function getUserData() view returns (string, string)",
  "function isUserRegistered(address user) view returns (bool)",
  "function getAllRegisteredUsers() view returns (address[] memory)",
  "function getAllRegisteredConnectedUsers() view returns (address[] memory)",

  // Post functions
  "function createPost(string memory description, string[] memory hashtags, string memory mediaHash, string memory cid)",
  "function likePost(uint256 postId)",
  "function addComment(uint256 postId, string memory text)",
  "function getPostComments(uint256 postId) view returns (tuple(uint256 postId, address commenter, string text, uint256 timestamp)[] memory)",
  "function getTotalPosts() view returns (uint256)",
  "function getAllPosts() view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes, bool active)[] memory)",
  "function getUserPosts(address user) view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes, bool active)[] memory)",
  "function postLikes(uint256 postId, address user) view returns (bool)",
  "function getPostById(uint256 postId) view returns (tuple(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid, uint256 likes, bool active))",

  // Friend functions
  "function sendFriendRequest(address to)",
  "function acceptFriendRequest(address from)",
  "function getFriendRequests() view returns (address[] memory)",
  "function getReceivedFriendRequests() view returns (address[] memory)",
  "function getSentFriendRequests() view returns (address[] memory)",
  "function getFriends(address user) view returns (address[] memory)",
  "function areFriends(address user1, address user2) view returns (bool)",

  // Message functions
  "function sendMessage(address to, string memory text)",
  "function getMessages(address with) view returns (tuple(address sender, string text, uint256 timestamp)[] memory)",

  // Validator functions
  "function becomeValidator() payable",
  "function withdrawStake()",
  "function reportPost(uint256 postId)",
  "function voteOnReport(uint256 postId, bool vote)",
  "function appealDecision(uint256 postId)",
  "function voteOnAppeal(uint256 postId, bool vote)",
  "function finalizeRemoval(uint256 postId)",
  "function getAppealJurors(uint256 postId) view returns (address[] memory)",
  "function isActiveValidator(address _address) view returns (bool)",
  "function getReportedPostIds() view returns (uint256[] memory)",
];

// Core contract utilities

export const getContract = (
  providerOrSigner: ethers.Provider | ethers.Signer
): ethers.Contract => {
  return new ethers.Contract(contractAddress, contractABI, providerOrSigner);
};

interface KeyAndIV {
  key: CryptoJS.lib.WordArray;
  iv: CryptoJS.lib.WordArray;
}

export const deriveKeyAndIV = (userAddress: string): KeyAndIV => {
  const hash = CryptoJS.SHA256(userAddress);
  const key = CryptoJS.enc.Hex.parse(hash.toString().substring(0, 64));
  const iv = CryptoJS.enc.Hex.parse(hash.toString().substring(64, 96));
  return { key, iv };
};

export const encryptData = (data: string, userAddress: string): string => {
  const { key, iv } = deriveKeyAndIV(userAddress);
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const decryptData = (
  encryptedText: string,
  userAddress: string
): string => {
  const { key, iv } = deriveKeyAndIV(userAddress);
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// User functions
export const registerUser = async (
  signer: ethers.Signer,
  userAddress: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const contract = getContract(signer);
    const wallet = ethers.Wallet.createRandom();
    const encryptedAddress = encryptData(wallet.address, userAddress);
    const encryptedPrivateKey = encryptData(wallet.privateKey, userAddress);
    const tx = await contract.aasetUserData(wallet.address, wallet.privateKey);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const fetchUserData = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<{ encryptedAddress: string; encryptedPrivateKey: string }> => {
  try {
    const contract = getContract(provider);
    const [encryptedAddress, encryptedPrivateKey] = await contract.getUserData({
      from: userAddress,
    });
    return { encryptedAddress, encryptedPrivateKey };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const checkUserRegistered = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<boolean> => {
  try {
    const contract = getContract(provider);
    return await contract.isUserRegistered(userAddress);
  } catch (error) {
    console.error("Error checking user registration:", error);
    throw error;
  }
};

// Post functions
export const createPost = async (
  userAddress: string,
  description: string,
  hashtags: string[],
  mediaHash: string,
  cid: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.createPost(description, hashtags, mediaHash, cid);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const likePost = async (
  userAddress: string,
  postId: number
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.likePost(postId);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const addComment = async (
  userAddress: string,
  postId: number,
  text: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.addComment(postId, text);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getPostComments = async (
  provider: ethers.Provider,
  postId: number
): Promise<any[]> => {
  try {
    const contract = getContract(provider);
    return await contract.getPostComments(postId);
  } catch (error) {
    console.error("Error fetching post comments:", error);
    throw error;
  }
};

// export const getAllPosts = async (
//   provider: ethers.Provider
// ): Promise<any[]> => {
//   try {
//     const contract = getContract(provider);
//     return await contract.getAllPosts();
//   } catch (error) {
//     console.error("Error fetching all posts:", error);
//     throw error;
//   }
// };
export const getAllPosts = async (provider: ethers.Provider) => {
  const contract = getContract(provider);
  const posts = await contract.getAllPosts();
  console.log("posts", posts);

  return posts.map((post: any) => ({
    id: post.id.toString(),
    user: post.user,
    description: post.description,
    mediaHash: post.mediaHash,
    likes: Number(post.likes),
    hashtags: post.hashtags,
    cid: post.cid,
    active: post.active,
  }));
};

export const getUserPosts = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<any[]> => {
  try {
    const contract = getContract(provider);
    return await contract.getUserPosts(userAddress);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Friend functions
export const sendFriendRequest = async (
  userAddress: string,
  to: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.sendFriendRequest(to);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (
  userAddress: string,
  from: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.acceptFriendRequest(from);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

export const getFriendRequests = async (
  userAddress: string
): Promise<string[]> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.getFriendRequests();
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

export const getFriends = async (
  provider: ethers.Provider,
  userAddress: string
): Promise<string[]> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.getFriends(wallet.address);
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

// Message functions
export const sendMessage = async (
  userAddress: string,
  to: string,
  text: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.sendMessage(to, text);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessages = async (
  userAddress: string,
  withAddress: string
): Promise<any[]> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.getMessages(withAddress);
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Validator functions
export const becomeValidator = async (
  userAddress: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.becomeValidator({
      value: ethers.parseEther("0.05"),
    });
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error becoming validator:", error);
    throw error;
  }
};

export const withdrawStake = async (
  userAddress: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.withdrawStake();
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error withdrawing stake:", error);
    throw error;
  }
};

export const reportPost = async (
  userAddress: string,
  postId: number
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.reportPost(postId);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error reporting post:", error);
    throw error;
  }
};

export const voteOnReport = async (
  userAddress: string,
  postId: number,
  vote: boolean
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.voteOnReport(postId, vote);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error voting on report:", error);
    throw error;
  }
};

export const appealDecision = async (
  userAddress: string,
  postId: number
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.appealDecision(postId);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error appealing decision:", error);
    throw error;
  }
};

export const voteOnAppeal = async (
  userAddress: string,
  postId: number,
  vote: boolean
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.voteOnAppeal(postId, vote);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error voting on appeal:", error);
    throw error;
  }
};

export const finalizeRemoval = async (
  userAddress: string,
  postId: number
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);

    const tx = await contract.finalizeRemoval(postId);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Error finalizing removal:", error);
    throw error;
  }
};

export const getAppealJurors = async (
  provider: ethers.Provider,
  postId: number
): Promise<string[]> => {
  try {
    const contract = getContract(provider);
    return await contract.getAppealJurors(postId);
  } catch (error) {
    console.error("Error fetching appeal jurors:", error);
    throw error;
  }
};

export const getAllRegisteredUsers = async (
  provider: ethers.Provider
): Promise<string[]> => {
  try {
    const contract = getContract(provider);
    return await contract.getAllRegisteredUsers();
  } catch (error) {
    console.error("Error fetching all registered users:", error);
    throw error;
  }
};

export const getAllRegisteredConnectedUsers = async (
  provider: ethers.Provider
): Promise<string[]> => {
  try {
    const contract = getContract(provider);
    return await contract.getAllRegisteredConnectedUsers();
  } catch (error) {
    console.error("Error fetching all registered connected users:", error);
    throw error;
  }
};

export const getBalance = async (
  provider: ethers.Provider,
  encryptedAddress: string
) => {
  const balance = await provider.getBalance(encryptedAddress);
  return ethers.formatEther(balance);
};

export const getReceivedFriendRequests = async (
  userAddress: string
): Promise<string[]> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.getReceivedFriendRequests();
  } catch (error) {
    console.error("Error fetching received friend requests:", error);
    throw error;
  }
};

export const getSentFriendRequests = async (
  userAddress: string
): Promise<string[]> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.getSentFriendRequests();
  } catch (error) {
    console.error("Error fetching sent friend requests:", error);
    throw error;
  }
};

// Add new validator functions
export const isActiveValidator = async (
  provider: ethers.Provider,
  address: string
): Promise<boolean> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, address);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.isActiveValidator(wallet.address);
  } catch (error) {
    console.error("Error checking validator status:", error);
    throw error;
  }
};

export const getReportedPostIds = async (
  userAddress: string
): Promise<number[]> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    return await contract.getReportedPostIds();
  } catch (error) {
    console.error("Error fetching reported post IDs:", error);
    throw error;
  }
};

export const getPostById = async (
  provider: ethers.Provider,
  postId: number,
  userAddress: string
): Promise<any> => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
    const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
    const contract = getContract(wallet);
    const post = await contract.getPostById(postId);
    return {
      id: post.id.toString(),
      user: post.user,
      description: post.description,
      mediaHash: post.mediaHash,
      likes: Number(post.likes),
      hashtags: post.hashtags,
      cid: post.cid,
      active: post.active,
    };
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
};
