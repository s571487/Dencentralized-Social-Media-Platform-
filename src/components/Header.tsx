import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
const Header: React.FC = () => {
  return (
    <header
      style={{
        padding: '12px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <input
          type="search"
          placeholder="Search"
          style={{
            width: '100%',
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#f5f5f5',
            fontSize: '14px',
          }}
        />
      </div>
      <ConnectButton />
    </header>
  );
};
export default Header;