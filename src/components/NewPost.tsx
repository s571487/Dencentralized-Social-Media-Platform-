import React, { useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { ethers } from "ethers";
import { fetchUserData } from "../contracts/contractInteractions";
import { pinata } from "../utils/config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { contractAddress, contractABI } from '../contracts/contractInteractions';

const NewPost = () => {
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
    return new ethers.Contract(contractAddress, contractABI, providerOrSigner);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error('File size exceeds 5MB limit.');
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
      
      const { encryptedPrivateKey } = await fetchUserData(provider, userAddress);
      if (!encryptedPrivateKey) throw new Error("DeSocial private key not available");

      let mediaHash = "";
      if (media) {
        const upload = await pinata.upload.file(media);
        mediaHash = upload.IpfsHash;
      }

      const hashtagsArray = hashtags.split(',').map(tag => tag.trim());
      const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
      const contract = getContract(wallet);

      const tx = await contract.createPost(description, hashtagsArray, mediaHash, mediaHash);
      await tx.wait();
      
      toast.success("Post created successfully!");
      setDescription('');
      setHashtags('');
      setMedia(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(`Error creating post: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create post</h2>
      </div>

      <div className="p-4 space-y-4">
        <textarea
          className="w-full min-h-[120px] p-3 text-gray-900 dark:text-gray-100 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {!media ? (
          <label htmlFor="media-upload" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer">
            <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400">
              <ImagePlus className="w-8 h-8" />
              <span>Add photos or videos</span>
              <span className="text-xs">Maximum file size: 5MB</span>
            </div>
            <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" id="media-upload" />
          </label>
        ) : (
          <div className="relative">
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />}
            <button onClick={removeMedia} className="absolute top-2 right-2 p-1 bg-gray-900/60 rounded-full text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full py-2.5 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
          onClick={handlePost}
          disabled={isPosting || (!description && !media)}
        >
          {isPosting ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Posting...</span></> : <span>Post</span>}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default NewPost;
