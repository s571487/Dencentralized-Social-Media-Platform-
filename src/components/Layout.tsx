import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PostFeed from './PostFeed';

interface LayoutProps {
  userAddress: string;
}

const Layout: React.FC<LayoutProps> = ({ userAddress }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header userAddress={userAddress} />
      <div className="flex max-w-7xl mx-auto pt-16">
        <Sidebar />
        <main className="flex-1 px-4 py-6">
          <PostFeed />
        </main>
      </div>
    </div>
  );
};

export default Layout;