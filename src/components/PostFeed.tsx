import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const PostFeed: React.FC = () => {
  // Sample posts data
  const posts = [
    {
      id: 1,
      address: '0x1234...5678',
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      likes: 156,
      comments: 23,
      description: 'Exploring the future of decentralized social media! #Web3 #Blockchain',
    },
    {
      id: 2,
      address: '0x9abc...def0',
      image: 'https://images.unsplash.com/photo-1682687221038-404670f19d1e',
      likes: 89,
      comments: 12,
      description: 'Building the next generation of social platforms 🚀',
    },
  ];

  return (
    // Motion container for fade-in effect
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {posts.map((post, index) => (
        // Motion wrapper for each post with animation
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm
                   border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
        >
          {/* Post Header with User Address */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="font-mono font-medium text-gray-800 dark:text-gray-200">{post.address}</div>
          </div>

          {/* Post Image */}
          <img
            src={post.image}
            alt="Post content"
            className="w-full aspect-video object-cover"
          />

          {/* Post Content: Likes, Comments, Description */}
          <div className="p-4">
            {/* Like and Comment Buttons */}
            <div className="flex space-x-4 mb-4">
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <Heart className="h-6 w-6" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                <MessageCircle className="h-6 w-6" />
                <span>{post.comments}</span>
              </button>
            </div>

            {/* Post Description */}
            <p className="text-gray-800 dark:text-gray-200">{post.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostFeed;
