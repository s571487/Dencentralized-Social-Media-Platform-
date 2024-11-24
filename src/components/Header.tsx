// Header.tsx
import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src="/path/to/logo.png" alt="Logo" style={styles.logo} />
      </div>
      <input type="text" placeholder="Search..." style={styles.searchBar} />
      <div style={styles.walletAddress}>
        <span>0xYourWalletAddress</span>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ddd',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px',
    height: '40px',
    marginRight: '10px',
  },
  searchBar: {
    flex: 1,
    padding: '5px 10px',
    margin: '0 20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  walletAddress: {
    fontSize: '14px',
    color: '#333',
  },
};

export default Header;
