import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import Logo from '../assets/logo.png';

const Sidebar: React.FC = () => {
  const styles = {
    container: {
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e0e0e0',
      padding: '20px',
      position: 'fixed' as 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '32px',
    },
    logo: {
      width: '48px',
      height: '48px',
    },
    nav: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '24px',
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      fontSize: '16px',
      padding: '8px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: 500,
      transition: 'background-color 0.2s ease-in-out',
    },
  };

  return (
    <div style={styles.container}>
      {/* Logo */}
      <img src={Logo} alt="Logo" style={styles.logo} />

      {/* Navigation */}
      <nav style={styles.nav}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <Link to="/home" style={styles.link}>
              🏠 Home
            </Link>
          </li>
          <li>
            <Link to="/profile" style={styles.link}>
              👤 Profile
            </Link>
          </li>
          <li>
            <Link to="/newpost" style={styles.link}>
              ➕ New Post
            </Link>
          </li>
          <li>
            <Link to="/chats" style={styles.link}>
              💬 Chats
            </Link>
          </li>
          <li>
            <Link to="/validator" style={styles.link}>
              📦 Validator
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;