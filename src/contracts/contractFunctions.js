import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Ethereum Provider
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);

// Smart Contract Details
const CONTRACTS = {
  DeSocialProfileData: "0x4aF6DE7c9976C4415c4C6cb48301337C6CCF4d95",
  DeSocialPosts: "0xdd2D7Bb7b7D15658f838683fd94E840d08241Ced",
};

const ABIS = {
  DeSocialProfileData: [
    "function getUserData(address user) public view returns (string memory, string memory)",
  ],
  DeSocialPosts: [
    "function createPost(string memory _cid) public returns (uint postId)",
    "function editPost(uint _postId, string memory _newCid) public",
    "function deletePost(uint _postId) public",
  ],
};

// Get Contract Instance
async function getContract(contractName, signerOrProvider) {
  return new ethers.Contract(
    CONTRACTS[contractName],
    ABIS[contractName],
    signerOrProvider
  );
}

// Retrieve User Wallet
async function getUserWallet(userAddress) {
  const profileContract = await getContract("DeSocialProfileData", provider);
  const [, privateKey] = await profileContract.getUserData(userAddress);
  if (!privateKey)
    throw new Error("User not registered or private key missing");
  return new ethers.Wallet(privateKey, provider);
}

// Create Post Endpoint
app.post("/create-post", async (req, res) => {
  try {
    const { userAddress, ipfsCid } = req.body;
    const wallet = await getUserWallet(userAddress);
    const postContract = await getContract("DeSocialPosts", wallet);
    const tx = await postContract.createPost(ipfsCid);
    await tx.wait();
    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Edit Post Endpoint
app.put("/edit-post", async (req, res) => {
  try {
    const { userAddress, postId, newCid } = req.body;
    const wallet = await getUserWallet(userAddress);
    const postContract = await getContract("DeSocialPosts", wallet);
    const tx = await postContract.editPost(postId, newCid);
    await tx.wait();
    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete Post Endpoint
app.delete("/delete-post", async (req, res) => {
  try {
    const { userAddress, postId } = req.body;
    const wallet = await getUserWallet(userAddress);
    const postContract = await getContract("DeSocialPosts", wallet);
    const tx = await postContract.deletePost(postId);
    await tx.wait();
    res.json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
