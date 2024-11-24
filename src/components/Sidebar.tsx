// Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <div>
        <img src="/path/to/logo.png" alt="Platform Logo" style={styles.logoImage} />
      </div>
      <nav style={styles.nav}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/new-post">New Post</Link></li>
          <li><Link to="/chats">Chats</Link></li>
          <li><Link to="/validator">Validator</Link></li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    padding: '20px',
    color: '#fff',
  },
  logo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logoImage: {
    width: '100px',
    height: 'auto',
  },
  nav: {
    listStyleType: 'none',
    padding: 0,
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px',
    display: 'block',
    fontSize: '18px',
  },
};

export default Sidebar;
