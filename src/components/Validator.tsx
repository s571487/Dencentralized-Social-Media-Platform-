// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Check,
//   X,
//   Shield,
//   Clock,
//   Flag,
//   MessageCircle,
//   Heart,
// } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ethers } from "ethers";
// import {
//   isActiveValidator,
//   becomeValidator,
//   getReportedPostIds,
//   getPostById,
//   voteOnReport,
//   fetchUserData,
//   getPostComments,
// } from "../contracts/contractInteractions";

// interface Post {
//   id: string;
//   user: string;
//   description: string;
//   hashtags: string[];
//   mediaHash: string;
//   cid: string;
//   likes: number;
//   active: boolean;
// }

// interface Comment {
//   commenter: string;
//   text: string;
// }

// const Validator = () => {
//   const [isValidator, setIsValidator] = useState<boolean>(false);
//   const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [votingPeriod, setVotingPeriod] = useState<number>(24 * 60 * 60); // 24 hours in seconds
//   const [userAddress, setUserAddress] = useState<string>("");
//   const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const accounts = await provider.send("eth_requestAccounts", []);
//         const { encryptedPrivateKey } = await fetchUserData(
//           provider,
//           accounts[0]
//         );
//         const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
//         setUserAddress(wallet.address);
//         const status = await isActiveValidator(provider, wallet.address);
//         setIsValidator(status);
//         if (status) {
//           await loadReportedPosts(provider);
//         }
//       } catch (error) {
//         console.error("Error initializing:", error);
//         toast.error("Failed to initialize validator dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
//     initialize();
//   }, []);

//   const loadReportedPosts = async (provider: ethers.Provider) => {
//     try {
//       const reportedPostIds = await getReportedPostIds(userAddress);
//       console.log("reportedPostIds", reportedPostIds);

//       const reportedPostsPromises = reportedPostIds.map(
//         async (postId: number) => {
//           try {
//             return await getPostById(provider, postId, userAddress);
//           } catch (error: any) {
//             // Skip posts that are inactive and not owned by the caller
//             if (
//               error.message?.includes(
//                 "Post is inactive and not owned by caller"
//               )
//             ) {
//               console.log(`Skipping inactive post ${postId}`);
//               return null;
//             }
//             throw error;
//           }
//         }
//       );

//       const reportedPostsResults = await Promise.all(reportedPostsPromises);
//       const reportedPosts = reportedPostsResults.filter(
//         (post) => post !== null
//       );
//       console.log("reportedPosts", reportedPosts);

//       // Fetch comments for each post
//       const commentsPromises = reportedPosts.map(async (post) => {
//         const postComments = await getPostComments(provider, Number(post.id));
//         return { postId: post.id, comments: postComments };
//       });
//       const commentsData = await Promise.all(commentsPromises);
//       const commentsMap: { [postId: string]: Comment[] } = {};
//       commentsData.forEach(({ postId, comments }) => {
//         commentsMap[postId] = comments;
//       });
//       setComments(commentsMap);

//       setReportedPosts(reportedPosts);
//     } catch (error: any) {
//       console.error("Error loading reported posts:", error);
//       toast.error("Failed to load reported posts");
//     }
//   };

//   const handleBecomeValidator = async () => {
//     try {
//       await becomeValidator(userAddress);
//       setIsValidator(true);
//       toast.success("Successfully became a validator!");
//     } catch (error) {
//       console.error("Error becoming validator:", error);
//       toast.error("Failed to become validator");
//     }
//   };

//   const handleVote = async (postId: number, vote: boolean) => {
//     try {
//       await voteOnReport(userAddress, postId, vote);
//       toast.success(`Vote ${vote ? "Yes" : "No"} recorded successfully`);
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await loadReportedPosts(provider);
//     } catch (error) {
//       console.error("Error voting:", error);
//       toast.error("Failed to record vote");
//     }
//   };

//   const formatTimeRemaining = (timestamp: number) => {
//     const now = Math.floor(Date.now() / 1000);
//     const remaining = timestamp + votingPeriod - now;
//     if (remaining <= 0) return "Voting period ended";
//     const hours = Math.floor(remaining / 3600);
//     const minutes = Math.floor((remaining % 3600) / 60);
//     return `${hours}h ${minutes}m remaining`;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (!isValidator) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen p-6">
//         <Shield className="w-24 h-24 text-blue-500 mb-6" />
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
//           Become a Validator
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
//           Join our validator network by staking 0.05 ETH. Help maintain the
//           quality of content on our platform.
//         </p>
//         <button
//           onClick={handleBecomeValidator}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg
//                      transform hover:scale-105 transition-all duration-200"
//         >
//           Stake 0.05 ETH to Become Validator
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//           Validator Dashboard
//         </h2>
//         <div className="flex items-center text-gray-600 dark:text-gray-300">
//           <Shield className="w-5 h-5 mr-2" />
//           <span>Active Validator</span>
//         </div>
//       </div>

//       {reportedPosts.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600 dark:text-gray-300">
//             No reported posts to review at the moment.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {reportedPosts.map((post) => (
//             <motion.div
//               key={post.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm
//                        border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
//             >
//               <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//                 <div className="flex items-center space-x-2">
//                   <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
//                     {post.user}
//                   </div>
//                 </div>
//                 <button
//                   className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
//                   title="Report post (already reported)"
//                 >
//                   <Flag className="h-5 w-5" />
//                 </button>
//               </div>
//               {post.mediaHash && (
//                 <img
//                   src={`https://sapphire-cautious-crab-180.mypinata.cloud/ipfs/${post.mediaHash}`}
//                   alt="Post content"
//                   className="w-full max-h-[400px] object-cover"
//                 />
//               )}
//               <div className="p-4">
//                 <p className="text-gray-800 dark:text-gray-200 mb-4">
//                   {post.description}
//                 </p>
//                 <div className="flex space-x-4 mb-4 text-gray-600 dark:text-gray-400">
//                   <div className="flex items-center space-x-1">
//                     <Heart className="h-6 w-6" />
//                     <span>{post.likes}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <MessageCircle className="h-6 w-6" />
//                     <span>{comments[post.id]?.length || 0}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         post.active
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {post.active ? "Active" : "Inactive"}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
//                   {comments[post.id]?.map((comment, index) => (
//                     <div
//                       key={index}
//                       className="text-sm text-gray-600 dark:text-gray-300"
//                     >
//                       <span className="font-medium">{comment.commenter}</span>:{" "}
//                       {comment.text}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center text-gray-600 dark:text-gray-300">
//                     <Clock className="w-4 h-4 mr-2" />
//                     <span className="text-sm">
//                       {formatTimeRemaining(Math.floor(Date.now() / 1000))}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-4 mt-4">
//                   <button
//                     onClick={() => handleVote(Number(post.id), true)}
//                     className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//                   >
//                     <X className="w-4 h-4 mr-2" />
//                     Remove
//                   </button>
//                   <button
//                     onClick={() => handleVote(Number(post.id), false)}
//                     className="flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
//                   >
//                     <Check className="w-4 h-4 mr-2" />
//                     Keep
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       )}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default Validator;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Shield,
  Clock,
  Flag,
  MessageCircle,
  Heart,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import {
  isActiveValidator,
  becomeValidator,
  getReportedPostIds,
  getPostById,
  voteOnReport,
  fetchUserData,
  getPostComments,
} from "../contracts/contractInteractions";

interface Post {
  id: string;
  user: string;
  description: string;
  hashtags: string[];
  mediaHash: string;
  cid: string;
  likes: number;
  active: boolean;
}

interface Comment {
  commenter: string;
  text: string;
}

const Validator = () => {
  const [isValidator, setIsValidator] = useState<boolean>(false);
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [votingPeriod, setVotingPeriod] = useState<number>(24 * 60 * 60); // 24 hours in seconds
  const [userAddress, setUserAddress] = useState<string>("");
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});

  useEffect(() => {
    const initialize = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const { encryptedPrivateKey } = await fetchUserData(
          provider,
          accounts[0]
        );
        const wallet = new ethers.Wallet(encryptedPrivateKey, provider);
        setUserAddress(wallet.address);
        const status = await isActiveValidator(provider, wallet.address);
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
      const reportedPostIds = await getReportedPostIds(userAddress);
      console.log("reportedPostIds", reportedPostIds);

      const reportedPostsPromises = reportedPostIds.map(
        async (postId: number) => {
          try {
            return await getPostById(provider, postId, userAddress);
          } catch (error: any) {
            // Skip posts that are inactive and not owned by the caller
            if (
              error.message?.includes(
                "Post is inactive and not owned by caller"
              )
            ) {
              console.log(`Skipping inactive post ${postId}`);
              return null;
            }
            throw error;
          }
        }
      );

      const reportedPostsResults = await Promise.all(reportedPostsPromises);
      const reportedPosts = reportedPostsResults.filter(
        (post) => post !== null
      );
      console.log("reportedPosts", reportedPosts);

      // Fetch comments for each post
      const commentsPromises = reportedPosts.map(async (post) => {
        const postComments = await getPostComments(provider, Number(post.id));
        return { postId: post.id, comments: postComments };
      });
      const commentsData = await Promise.all(commentsPromises);
      const commentsMap: { [postId: string]: Comment[] } = {};
      commentsData.forEach(({ postId, comments }) => {
        commentsMap[postId] = comments;
      });
      setComments(commentsMap);

      setReportedPosts(reportedPosts);
    } catch (error: any) {
      console.error("Error loading reported posts:", error);
      toast.error("Failed to load reported posts");
    }
  };

  const handleBecomeValidator = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceInWei = await provider.getBalance(userAddress);
      const balanceInEth = ethers.formatEther(balanceInWei);
      const balance = parseFloat(balanceInEth);
      const minimumBalance = 0.05;

      if (balance < minimumBalance) {
        window.alert(
          "Not enough balance available for stake. Minimum 0.05 ETH required."
        );
        return;
      }

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
              className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm
                       border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
                    {post.user}
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Report post (already reported)"
                >
                  <Flag className="h-5 w-5" />
                </button>
              </div>
              {post.mediaHash && (
                <img
                  src={`https://sapphire-cautious-crab-180.mypinata.cloud/ipfs/${post.mediaHash}`}
                  alt="Post content"
                  className="w-full max-h-[400px] object-cover"
                />
              )}
              <div className="p-4">
                <p className="text-gray-800 dark:text-gray-200 mb-4">
                  {post.description}
                </p>
                <div className="flex space-x-4 mb-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-6 w-6" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-6 w-6" />
                    <span>{comments[post.id]?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {post.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {comments[post.id]?.map((comment, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span className="font-medium">{comment.commenter}</span>:{" "}
                      {comment.text}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {formatTimeRemaining(Math.floor(Date.now() / 1000))}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => handleVote(Number(post.id), false)}
                    className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                  <button
                    onClick={() => handleVote(Number(post.id), true)}
                    className="flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Keep
                  </button>
                </div>
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
