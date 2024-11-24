import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Feed from '../components/Feed';

const HomePage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        position: 'relative',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: '240px',
          flex: 1,
        }}
      >
        {/* Header */}
        <Header />

        {/* Feed Area */}
        <main
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '24px',
          }}
        >
          <Feed />
        </main>
      </div>
    </div>
  );
};

export default HomePage;