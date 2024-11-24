import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
 
const NewPost: React.FC = () => {
  // Inline styles with TypeScript
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      height: '100vh',
    },
    sidebar: {
      width: '240px', // Fixed width for sidebar
      backgroundColor: '#f0f0f0', // Light grey
      position: 'fixed', // Sidebar stays fixed on the left
      height: '100vh',
      left: 0,
      top: 0,
    },
    mainContent: {
      marginLeft: '240px', // Align content to the right of the sidebar
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 240px)', // Full width minus sidebar width
      backgroundColor: '#000', // Black background
    },
    navbar: {
      height: '60px', // Fixed height for header
      display: 'flex',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#fff', // White background
      borderBottom: '1px solid #ddd', // Optional border for separation
      position: 'sticky', // Makes the header sticky
      top: 0,
      zIndex: 10, // Ensures it stays above other elements
    },
    newPost: {
      flex: 1,
      padding: '20px',
      color: '#fff', // White text
      backgroundColor: '#111', // Slightly lighter black for contrast
    },
    uploadContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      marginBottom: '20px',
    },
    uploadBox: {
      textAlign: 'center',
    },
    uploadIcon: {
      height: '50px',
      marginBottom: '10px',
    },
    captionContainer: {
      marginTop: '20px',
    },
    captionInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      outline: 'none',
      fontSize: '16px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    button: {
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'opacity 0.3s ease',
    },
    cancelButton: {
      backgroundColor: 'red',
    },
    postButton: {
      backgroundColor: 'blue',
    },
  };
 
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = '0.8';
  };
 
  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.opacity = '1';
  };
 
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <Sidebar />
      </div>
 
      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Navbar */}
        <div style={styles.navbar}>
          <Header />
        </div>
 
        {/* New Post Section */}
        <div style={styles.newPost}>
          <h2>New Post</h2>
          <div style={styles.uploadContainer}>
            <div style={styles.uploadBox}>
              <img
                src="/path-to-camera-icon.png" // Replace with your image path or use an import
                alt="Upload"
                style={styles.uploadIcon}
              />
              <p>Click to upload/take an image/video</p>
            </div>
          </div>
          <div style={styles.captionContainer}>
            <textarea
              style={styles.captionInput}
              placeholder="Caption"
              rows={3}
            ></textarea>
          </div>
          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Cancel
            </button>
            <button
              style={{ ...styles.button, ...styles.postButton }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default NewPost;
