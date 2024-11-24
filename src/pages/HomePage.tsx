import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Feed from '../components/Feed';
import Logo from "../assets/logo.png";
import dp from "../assets/dp.png";
import { ConnectButton } from '@rainbow-me/rainbowkit';


const HomePage = () => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',

      }}>
        <img 
          src={Logo}
          alt="Logo" 
          style={{
            width: '48px',
            height: '48px'
          }}
        />
        
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <NavItem icon="🏠" text="HOME" />
          <NavItem icon="👤" text="PROFILE" />
          <NavItem icon="➕" text="NEW POST" />
          <NavItem icon="💬" text="CHATS" />
          <NavItem icon="📦" text="VALIDATOR" />
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '240px',
        flex: 1,
      }}>
        {/* Header */}
        <header style={{
          padding: '12px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <input 
              type="search"
              placeholder="Search"
              style={{
                width: '100%',
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#f5f5f5',
                fontSize: '14px'
              }}
            />
          </div>
          <ConnectButton></ConnectButton>
        </header>

        {/* Feed Area */}
        <main style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '24px',
        }}>
          <Feed />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text }: { icon: string; text: string }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
  }}>
    <span>{icon}</span>
    <span style={{
      fontWeight: 500
    }}>{text}</span>
  </div>
);

export default HomePage;