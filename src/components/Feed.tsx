// Feed.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from '../config'; // ABI of the DecentralizedSocial contract
import dp from "../assets/dp.png";


const Feed = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const contractAddress = '0x82714f94c5E7F1330cB9F51Ee918eC092E5928FA'; // Replace with your smart contract address

  useEffect(() => {
    if (window.ethereum) {
      const setupProviderAndContract = async () => {
        try {
          // Create a web3 provider using window.ethereum
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          // Get the signer from the web3Provider
          const signer = await web3Provider.getSigner();

          // Set the wallet address
          const address = await signer.getAddress();
          setWalletAddress(address);

          // Create a contract instance connected to both signer and provider
          const userContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(userContract);
        } catch (error) {
          console.error("Error setting up provider and contract:", error);
        }
      };

      setupProviderAndContract();
    } else {
      console.log("No Ethereum provider found");
    }
  }, []);

  useEffect(() => {
    if (contract && walletAddress) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          // Fetch all post IDs from the contract
          const totalPosts = await contract.platformStats();
          const postsArray = [];

          // Fetch each post by ID
          for (let i = 1; i <= totalPosts.totalPosts; i++) {
            const post = await contract.posts(i);
            postsArray.push(post);
          }

          setPosts(postsArray);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
        setLoading(false);
      };

      fetchPosts();
    }
  }, [contract, walletAddress]);

//   return (
//     <div>
//       <h2>Welcome, {walletAddress}</h2>
//       <h3>Posts Feed</h3>

//       {loading ? (
//         <p>Loading posts...</p>
//       ) : (
//         posts.length > 0 ? (
//           posts.map((post, index) => (
//             <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
//               <h4>{post.description}</h4>
//               <img src={post.ipfsLink} alt="Post Image" style={{ width: '100%', maxWidth: '600px' }} />
//               <p>{Array.isArray(post.hashtags) ? post.hashtags.join(', ') : 'No hashtags'}</p>
//               <p>{post.likeCount} Likes | {post.commentCount} Comments</p>
//             </div>
//           ))
//         ) : (
//           <p>No posts are there.</p>
//         )
//       )}
//     </div>
//   );

return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
    }}>
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '20px'
        }}>Loading posts...</div>
      ) : (
        posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              marginBottom: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}>
              <div style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img 
                    src={dp}
                    alt="Profile" 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%'
                    }}
                  />
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>{post.user?.walletAddress || walletAddress}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#666'
                    }}>Kansas, USA</p>
                  </div>
                </div>
                <button style={{
                  backgroundColor: '#4747ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 16px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>FOLLOW</button>
              </div>

              <img 
                src={post.ipfsLink} 
                alt="Post" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />

              <div style={{
                padding: '16px'
              }}>
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px'
                }}>{post.description}</p>

                <div style={{
                  marginBottom: '16px'
                }}>
                  {post.hashtags?.map((tag: string, idx: number) => (
                    <span key={idx} style={{
                      color: '#4747ff',
                      marginRight: '8px',
                      fontSize: '14px'
                    }}>#{tag}</span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px'
                }}>
                  <button style={actionButtonStyle}>
                    <span>👍</span> LIKE
                  </button>
                  <button style={actionButtonStyle}>
                    <span>💬</span> COMMENT
                  </button>
                  <button style={actionButtonStyle}>
                    <span>↗️</span> SHARE
                  </button>
                  <button style={{
                    ...actionButtonStyle,
                    marginLeft: 'auto'
                  }}>
                    <span>💰</span> APPRECIATE
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{
            textAlign: 'center',
            color: '#666'
          }}>No posts available.</p>
        )
      )}
    </div>
  );
};

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: '#666',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: '500'
};

export default Feed;
