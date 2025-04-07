import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS if frontend is hosted separately

// Validate INFURA URL
if (!process.env.INFURA_URL) {
  throw new Error("Missing INFURA_URL in .env");
}

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
function getContract(contractName, signerOrProvider) {
  return new ethers.Contract(
    CONTRACTS[contractName],
    ABIS[contractName],
    signerOrProvider
  );
}

// Retrieve User Wallet
async function getUserWallet(userAddress) {
  if (!ethers.isAddress(userAddress)) {
    throw new Error("Invalid Ethereum address");
  }

  const profileContract = getContract("DeSocialProfileData", provider);
  const [, privateKey] = await profileContract.getUserData(userAddress);
  if (!privateKey)
    throw new Error("User not registered or private key missing");

  return new ethers.Wallet(privateKey, provider);
}

// Routes
app.post("/create-post", async (req, res) => {
  const { userAddress, ipfsCid } = req.body;

  if (!userAddress || !ipfsCid) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const wallet = await getUserWallet(userAddress);
    const postContract = getContract("DeSocialPosts", wallet);
    const tx = await postContract.createPost(ipfsCid);
    await tx.wait();

    res.status(201).json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/edit-post", async (req, res) => {
  const { userAddress, postId, newCid } = req.body;

  if (!userAddress || postId == null || !newCid) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const wallet = await getUserWallet(userAddress);
    const postContract = getContract("DeSocialPosts", wallet);
    const tx = await postContract.editPost(postId, newCid);
    await tx.wait();

    res.status(200).json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/delete-post", async (req, res) => {
  const { userAddress, postId } = req.body;

  if (!userAddress || postId == null) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const wallet = await getUserWallet(userAddress);
    const postContract = getContract("DeSocialPosts", wallet);
    const tx = await postContract.deletePost(postId);
    await tx.wait();

    res.status(200).json({ success: true, transactionHash: tx.hash });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
