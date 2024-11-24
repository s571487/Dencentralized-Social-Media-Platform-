import React from 'react';
import dp from "../assets/dp.png";


const Post = ({ post }: any) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <img 
          src={dp}
          alt="Profile" 
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            marginRight: '12px',
          }}
        />
        <div>
          <p style={{
            margin: '0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a1a1a',
          }}>{post.user.walletAddress}</p>
          <p style={{
            margin: '0',
            fontSize: '12px',
            color: '#666',
          }}>{post.user.location}</p>
        </div>
        <button style={{
          marginLeft: 'auto',
          padding: '6px 16px',
          backgroundColor: '#4747ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>FOLLOW</button>
      </div>

      <img 
        src={post.ipfsLink} 
        alt="Post" 
        style={{
          width: '100%',
          borderRadius: '4px',
          marginBottom: '12px',
        }}
      />

      <p style={{
        margin: '0 0 8px 0',
        fontSize: '14px',
        color: '#1a1a1a',
      }}>{post.description}</p>

      <div style={{
        marginBottom: '16px',
      }}>
        {post.hashtags.map((hashtag: string, index: number) => (
          <span key={index} style={{
            color: '#4747ff',
            marginRight: '8px',
            fontSize: '14px',
          }}>
            {hashtag}
          </span>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '24px',
      }}>
        <button style={actionButtonStyle}>
          <span style={actionIconStyle}>👍</span> LIKE
        </button>
        <button style={actionButtonStyle}>
          <span style={actionIconStyle}>💬</span> COMMENT
        </button>
        <button style={actionButtonStyle}>
          <span style={actionIconStyle}>↗️</span> SHARE
        </button>
        <button style={{
          ...actionButtonStyle,
          marginLeft: 'auto',
        }}>
          <span style={actionIconStyle}>💰</span> APPRECIATE
        </button>
      </div>
    </div>
  );
};

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  padding: '8px',
  fontSize: '14px',
  color: '#666',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const actionIconStyle = {
  fontSize: '16px',
};

export default Post;