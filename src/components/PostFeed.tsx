import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { ethers } from 'ethers';
import { 
  contractABI, 
  contractAddress, 
  getAllPosts, 
  fetchUserData, 
  getUserFriends, 
  sendFriendRequest, 
  likePost, 
  addComment,
  getPostComments
} from '../contracts/contractInteractions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Post {
  id: string;
  user: string;
  description: string;
  mediaHash: string;
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
}

interface Comment {
  commenter: string;
  text: string;
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [mainUser, setMainUser] = useState<string>('');
  const [encryptedUser, setEncryptedUser] = useState<string>('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setMainUser(userAddress);
          const userData = await fetchUserData(provider, userAddress);
          setEncryptedUser(userData.encryptedAddress);
  
          const [allPosts, userFriends] = await Promise.all([
            getAllPosts(provider),
            getUserFriends(provider, userAddress)
          ]);
  
          const postsWithCommentsAndLikes = await Promise.all(
            allPosts.map(async (post) => {
              const isLiked = await checkPostLike(provider, userAddress, Number(post.id));
              return {
                ...post,
                comments: await getPostComments(Number(post.id)),
                likedByUser: isLiked
              };
            })
          );
  
          setPosts(postsWithCommentsAndLikes);
          setFriends(userFriends);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchData();
  }, []);

  const checkPostLike = async (provider: ethers.Provider, userAddress: string, postId: number) => {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return await contract.postLikes(postId, userAddress);
  };

  const handleFollow = async (postAddress: string) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await sendFriendRequest(mainUser, postAddress);
        setFriends(prev => [...prev, postAddress]);
        toast.success("Friend request sent!");
      } catch (error) {
        toast.error("Error sending friend request");
        console.error('Error sending friend request:', error);
      }
    }
  };

  const handleLike = async (postId: string) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Optimistic update
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { 
                  ...post, 
                  likes: post.likes + (post.likedByUser ? -1 : 1),
                  likedByUser: !post.likedByUser
                }
              : post
          )
        );

        // Actual contract call
        await likePost(mainUser, Number(postId));
        
        // Verify with contract
        const actualLiked = await checkPostLike(provider, await signer.getAddress(), Number(postId));
        const actualLikes = (await getAllPosts(provider)).find(p => p.id === postId)?.likes;

        // Final update
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { 
                  ...post, 
                  likes: actualLikes || post.likes,
                  likedByUser: actualLiked
                }
              : post
          )
        );

        toast.success(actualLiked ? "Liked post!" : "Removed like");
      } catch (error) {
        toast.error("Error updating like");
        console.error('Error liking post:', error);
      }
    }
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const commentText = commentInputs[postId];
    if (commentText && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await addComment(mainUser, Number(postId), commentText);

        // Update comments
        const updatedComments = await getPostComments(Number(postId));
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? { ...post, comments: updatedComments }
              : post
          )
        );

        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        toast.success("Comment added!");
      } catch (error) {
        toast.error("Error adding comment");
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <ToastContainer position="bottom-right" />
      
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm
                     border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="font-mono font-medium text-gray-800 dark:text-gray-200">
              {post.user}
            </div>
            {post.user !== encryptedUser && !friends.includes(post.user) && (
              <button
                onClick={() => handleFollow(post.user)}
                className="font-mono font-medium text-blue-500 dark:text-blue-400 hover:underline"
              >
                Follow
              </button>
            )}
          </div>
          <img
            src={`https://sapphire-cautious-crab-180.mypinata.cloud/ipfs/${post.mediaHash}`}
            alt="Post content"
            className="w-full aspect-video object-cover"
          />
          <div className="p-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1 transition-colors ${
                  post.likedByUser 
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                }`}
              >
                <Heart className="h-6 w-6" />
                <span>{post.likes}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <MessageCircle className="h-6 w-6" />
                <span>{post.comments.length}</span>
              </div>
              <button className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mb-4">{post.description}</p>
            <div className="space-y-2 mb-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{comment.commenter}</span>: {comment.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 dark:text-gray-200"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostFeed;