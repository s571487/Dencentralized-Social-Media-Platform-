import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styled, { ThemeProvider } from 'styled-components';
import {
  getFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getAllPosts,
  fetchUserData
} from '../contracts/contractInteractions';

const lightTheme = {
  background: '#f3f4f6',
  text: '#1f2937',
  primary: '#3b82f6',
  secondary: '#10b981',
  disabled: '#f3f4f6',
  hoverPrimary: '#2563eb',
  hoverSecondary: '#059669',
};

const darkTheme = {
  background: '#1f2937',
  text: '#f3f4f6',
  primary: '#3b82f6',
  secondary: '#10b981',
  disabled: '#374151',
  hoverPrimary: '#4f46e5',
  hoverSecondary: '#14b8a6',
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${(props) => props.theme.disabled};
  padding-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${(props) => (props.active ? props.theme.primary : props.theme.background)};
  color: ${(props) => (props.active ? '#fff' : props.theme.text)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.active ? props.theme.hoverPrimary : props.theme.hoverSecondary)};
  }
`;

const UserList = styled.div`
  display: grid;
  gap: 1rem;
`;

const UserCard = styled.div`
  background: ${(props) => props.theme.background};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Address = styled.span`
  font-family: 'Roboto Mono', monospace;
  color: ${(props) => props.theme.text};
  font-size: 0.9rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'disabled' }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) => props.variant === 'primary' && `
    background: ${props.theme.primary};
    color: white;
    &:hover { background: ${props.theme.hoverPrimary}; }
  `}

  ${(props) => props.variant === 'secondary' && `
    background: ${props.theme.secondary};
    color: white;
    &:hover { background: ${props.theme.hoverSecondary}; }
  `}

  ${(props) => props.variant === 'disabled' && `
    background: ${props.theme.disabled};
    color: ${props.theme.text};
    cursor: not-allowed;
  `}
`;

const Friends: React.FC<{ userAddress: string }> = ({ userAddress }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'pending'>('all');
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [encryptedUser, setEncryptedUser] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("Friends userAddrsss", userAddress);
      
      const userData = await fetchUserData(provider, userAddress);
      setEncryptedUser(userData.encryptedAddress);
      
      
      const posts = await getAllPosts(provider);
      const users = [...new Set(posts.map(p => p.user))].filter(u => u !== userData.encryptedAddress);
      console.log("Frinds users", users);
      
      setAllUsers(users);

      // const friendsList = await getFriends(provider, userAddress);
      // console.log("Friends friendsList",friendsList);
      
      // setFriends(friendsList);

      const requests = await getFriendRequests(userAddress);
      console.log("Friends requests",requests);
      setPendingRequests(requests.filter(r => !r.accepted).map(r => r.to));

    };

    if (userAddress) loadData();
  }, [userAddress]);

  const handleFollow = async (targetAddress: string) => {
    await sendFriendRequest(userAddress, targetAddress);
    setPendingRequests(prev => [...prev, targetAddress]);
  };

  const handleAcceptRequest = async (requesterAddress: string) => {
    await acceptFriendRequest(userAddress, requesterAddress);
    setFriends(prev => [...prev, requesterAddress]);
    setPendingRequests(prev => prev.filter(a => a !== requesterAddress));
  };

  const getButtonState = (address: string) => {
    if (friends.includes(address)) return 'Friends';
    if (pendingRequests.includes(address)) return 'Pending';
    return 'Follow';
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Tabs>
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            All Users ({allUsers.length})
          </TabButton>
          <TabButton active={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
            Friends ({friends.length})
          </TabButton>
          <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
            Pending ({pendingRequests.length})
          </TabButton>
        </Tabs>
        <UserList>
          {activeTab === 'all' && allUsers.map(user => (
            <UserCard key={user}>
              <Address>{user}</Address>
              {getButtonState(user) === 'Follow' && (
                <ActionButton variant="primary" onClick={() => handleFollow(user)}>
                  Follow
                </ActionButton>
              )}
              {getButtonState(user) === 'Pending' && (
                <ActionButton variant="disabled">Pending</ActionButton>
              )}
              {getButtonState(user) === 'Friends' && (
                <ActionButton variant="disabled">Friends</ActionButton>
              )}
            </UserCard>
          ))}
          {activeTab === 'friends' && friends.map(friend => (
            <UserCard key={friend}>
              <Address>{friend}</Address>
              <ActionButton variant="disabled">Friends</ActionButton>
            </UserCard>
          ))}
          {activeTab === 'pending' && pendingRequests.map(request => (
            <UserCard key={request}>
              <Address>{request}</Address>
              <ActionButton variant="secondary" onClick={() => handleAcceptRequest(request)}>
                Pending
              </ActionButton>
            </UserCard>
          ))}
        </UserList>
      </Container>
    </ThemeProvider>
  );
};

export default Friends;
