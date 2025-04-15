import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Clock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import {
  isActiveValidator,
  becomeValidator,
  getReportedPostIds,
  getAllPosts,
  voteOnReport,
} from "../contracts/contractInteractions";

interface Post {
  id: number;
  user: string;
  description: string;
  hashtags: string[];
  mediaHash: string;
  cid: string;
  likes: number;
  active: boolean;
}

const Validator = () => {
  const [isValidator, setIsValidator] = useState<boolean>(false);
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [votingPeriod, setVotingPeriod] = useState<number>(24 * 60 * 60); // 24 hours in seconds
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setUserAddress(accounts[0]);
        const status = await isActiveValidator(provider, accounts[0]);
        setIsValidator(status);
        if (status) {
          await loadReportedPosts(provider);
        }
      } catch (error) {
        console.error("Error initializing:", error);
        toast.error("Failed to initialize validator dashboard");
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const loadReportedPosts = async (provider: ethers.Provider) => {
    try {
      // Get all reported post IDs
      const reportedPostIds = await getReportedPostIds(userAddress);

      // Get all posts
      const allPosts = await getAllPosts(provider);

      // Filter posts to only include reported ones
      const filteredPosts = allPosts.filter((post: Post) =>
        reportedPostIds.includes(post.id)
      );

      setReportedPosts(filteredPosts);
    } catch (error) {
      console.error("Error loading reported posts:", error);
      toast.error("Failed to load reported posts");
    }
  };

  const handleBecomeValidator = async () => {
    try {
      await becomeValidator(userAddress);
      setIsValidator(true);
      toast.success("Successfully became a validator!");
    } catch (error) {
      console.error("Error becoming validator:", error);
      toast.error("Failed to become validator");
    }
  };

  const handleVote = async (postId: number, vote: boolean) => {
    try {
      await voteOnReport(userAddress, postId, vote);
      toast.success(`Vote ${vote ? "Yes" : "No"} recorded successfully`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await loadReportedPosts(provider);
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Failed to record vote");
    }
  };

  const formatTimeRemaining = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = timestamp + votingPeriod - now;
    if (remaining <= 0) return "Voting period ended";

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isValidator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Shield className="w-24 h-24 text-blue-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Become a Validator
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
          Join our validator network by staking 0.05 ETH. Help maintain the
          quality of content on our platform.
        </p>
        <button
          onClick={handleBecomeValidator}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg
                     transform hover:scale-105 transition-all duration-200"
        >
          Stake 0.05 ETH to Become Validator
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Validator Dashboard
        </h2>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Shield className="w-5 h-5 mr-2" />
          <span>Active Validator</span>
        </div>
      </div>

      {reportedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            No reported posts to review at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reportedPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Post #{post.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    By: {post.user}
                  </p>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {formatTimeRemaining(Math.floor(Date.now() / 1000))}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-200">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="text-sm text-blue-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleVote(post.id, true)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </button>
                <button
                  onClick={() => handleVote(post.id, false)}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Keep
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Validator;
