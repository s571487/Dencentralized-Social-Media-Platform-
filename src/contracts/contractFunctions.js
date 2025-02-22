import { ethers } from "ethers";

// Contract Addresses
const CONTRACTS = {
  DeSocialProfileData: "0x4aF6DE7c9976C4415c4C6cb48301337C6CCF4d95",
  DeSocialPosts: "0xdd2D7Bb7b7D15658f838683fd94E840d08241Ced",
};

// ABIs
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

// Connect to Ethereum provider
async function getContract(contractName, signerOrProvider) {
  return new ethers.Contract(
    CONTRACTS[contractName],
    ABIS[contractName],
    signerOrProvider
  );
}

// Function to retrieve user data and initialize a wallet
async function getUserWallet(userAddress, provider) {
  const profileContract = await getContract("DeSocialProfileData", provider);
  const [, privateKey] = await profileContract.getUserData(userAddress);

  if (!privateKey)
    throw new Error("User not registered or private key missing");

  // Create wallet with private key
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Wallet Initialized:", wallet.address);
  return wallet;
}

// Function to create a post using the wallet
async function createPostWithUserWallet(userAddress, ipfsCid) {
  const provider = new ethers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
  ); // Replace with actual provider
  const wallet = await getUserWallet(userAddress, provider);

  // Get contract instance with the wallet as a signer
  const postContract = await getContract("DeSocialPosts", wallet);

  // Create post transaction
  const tx = await postContract.createPost(ipfsCid);
  await tx.wait();
  console.log("Post Created:", tx.hash);
}

// Function to edit a post
async function editPostWithUserWallet(userAddress, postId, newCid) {
  const provider = new ethers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
  );
  const wallet = await getUserWallet(userAddress, provider);
  const postContract = await getContract("DeSocialPosts", wallet);

  const tx = await postContract.editPost(postId, newCid);
  await tx.wait();
  console.log("Post Edited:", tx.hash);
}

// Function to delete a post
async function deletePostWithUserWallet(userAddress, postId) {
  const provider = new ethers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
  );
  const wallet = await getUserWallet(userAddress, provider);
  const postContract = await getContract("DeSocialPosts", wallet);

  const tx = await postContract.deletePost(postId);
  await tx.wait();
  console.log("Post Deleted:", tx.hash);
}
