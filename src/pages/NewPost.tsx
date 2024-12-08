import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Upload from "../assets/upload.png";
import { contractABI } from '../config'; // ABI of the DecentralizedSocial contract
import { ethers } from "ethers";


const contractAddress = "0x82714f94c5E7F1330cB9F51Ee918eC092E5928FA"; // Replace with your deployed contract address

const NewPost: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZDc1NDZhMi0yNmM5LTRiNjEtYTc0My02MmM3ODkyNjkzOGYiLCJlbWFpbCI6Im5hZ2FuaXRoaW5zeWRuZXlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImY1ZTVlN2QyYWM1OGU2NTZlN2Q5Iiwic2NvcGVkS2V5U2VjcmV0IjoiYWY4ZDJmZDIxMzhiNjlmMTAyNmRlMjU5NWQzYWM0N2YyODllMmM0YzMyNjlmYjU0NDMzZjYwZDNkM2I5NjJkOSIsImV4cCI6MTc2NDY0ODQxOH0.U1RAShy5OP3U-tixePTIqj8r3wEUMvmEXJJVXNLG0nw`, // Replace with your JWT
          },
        }
      );

      const cid = response.data.IpfsHash;
      setIpfsCid(`https://ipfs.io/ipfs/${cid}`);
      console.log("Uploaded to Pinata. CID:", cid);
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      alert("Failed to upload the file. Please try again.");
    }
  };

  const handlePost = async () => {
    if (!ipfsCid || !caption || !hashtags) {
      alert("Please complete all fields before posting.");
      return;
    }

    try {
          // Create a web3 provider using window.ethereum
          const web3Provider = new ethers.BrowserProvider(window.ethereum);

          // Get the signer from the web3Provider
          const signer = await web3Provider.getSigner();

          // Set the wallet address
          const address = await signer.getAddress();

          // Create a contract instance connected to both signer and provider
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

      // Split hashtags into an array
      const hashtagsArray = hashtags.split(",").map((tag) => tag.trim());

      // Call the createPost function
      const tx = await contract.createPost(ipfsCid, caption, hashtagsArray);
      await tx.wait();

      alert("Post created successfully!");
      console.log("Transaction:", tx);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create the post. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "280px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Header />

        {/* New Post Area */}
        <main
          style={{
            minWidth: "900px",
            margin: "0 auto",
            padding: "24px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            marginTop: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ marginBottom: "16px", textAlign: "center" }}>
            New Post
          </h2>

          {/* Upload Section */}
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "2px dashed #ccc",
              cursor: "pointer",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img
                src={Upload}
                alt="Upload"
                style={{ height: "50px", marginBottom: "10px" }}
              />
              <p>Click to upload/take an image/video</p>
              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </label>

          {ipfsCid && (
            <p style={{ textAlign: "center", color: "green" }}>
              File uploaded to IPFS with CID: {ipfsCid}
            </p>
          )}

          {/* Caption Section */}
          <textarea
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "16px",
              marginBottom: "20px",
            }}
            placeholder="Write a caption..."
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>

          {/* Hashtags Section */}
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "16px",
              marginBottom: "20px",
            }}
            placeholder="Enter hashtags (comma-separated)"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />

          {/* Buttons Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "opacity 0.3s ease",
              }}
              onClick={() => alert("Post canceled.")}
            >
              Cancel
            </button>
            <button
              style={{
                backgroundColor: "#3498db",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "opacity 0.3s ease",
              }}
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewPost;