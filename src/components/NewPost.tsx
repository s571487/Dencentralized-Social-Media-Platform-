import React, { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { fetchUserData } from "../contracts/contractInteractions";
import { pinata } from "../utils/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  contractAddress,
  contractABI,
} from "../contracts/contractInteractions";

const NewPost = () => {
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
    return new ethers.Contract(contractAddress, contractABI, providerOrSigner);
  };

  const handleMediaUpload = (file: File) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error("File size exceeds 5MB limit.");
    }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleMediaUpload(file);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    toast.info("Posting your content...");

    if (!window.ethereum) {
      toast.error("MetaMask is not installed.");
      setIsPosting(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const { encryptedPrivateKey } = await fetchUserData(
        provider,
        userAddress
      );
      if (!encryptedPrivateKey)
        throw new Error("DeSocial private key not available");

      let mediaHash = "";
      if (media) {
        const upload = await pinata.upload.file(media);
        mediaHash = upload.IpfsHash;
      }

      const hashtagsArray = hashtags.split(",").map((tag) => tag.trim());
      const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
      const contract = getContract(wallet);

      const tx = await contract.createPost(
        description,
        hashtagsArray,
        mediaHash,
        mediaHash
      );
      await tx.wait();

      toast.success("Post created successfully!");
      setDescription("");
      setHashtags("");
      setMedia(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(
        `Error creating post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Create a New Post
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <textarea
          className="w-full min-h-[150px] p-4 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {!media ? (
          <label
            htmlFor="media-upload"
            className={`flex items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-[#2a2a2a]"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <div className="flex flex-col items-center space-y-3 text-gray-500 dark:text-gray-300">
              <ImagePlus className="w-10 h-10" />
              <span className="text-sm font-medium">
                Drag & drop media here or click to upload
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-400">
                Maximum file size: 5MB
              </span>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMediaUpload(file);
              }}
              className="hidden"
              id="media-upload"
            />
          </label>
        ) : (
          <div className="relative group">
            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            <button
              onClick={removeMedia}
              className="absolute top-3 right-3 p-2 bg-gray-900/80 hover:bg-gray-900 rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePost}
          disabled={isPosting || (!description && !media)}
        >
          {isPosting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <span>Post</span>
          )}
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastClassName="dark:bg-[#2a2a2a] dark:text-white"
      />
    </div>
  );
};

export default NewPost;
