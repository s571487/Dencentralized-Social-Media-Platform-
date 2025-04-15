import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import styled, { ThemeProvider } from "styled-components";
import {
  getFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  getAllPosts,
  fetchUserData,
  getAllRegisteredUsers,
  getAllRegisteredConnectedUsers,
  getReceivedFriendRequests,
  getSentFriendRequests,
} from "../contracts/contractInteractions";

const lightTheme = {
  background: "#ffffff",
  text: "#1f2937",
  primary: "#3b82f6",
  secondary: "#10b981",
  disabled: "#e5e7eb",
  hoverPrimary: "#2563eb",
  hoverSecondary: "#059669",
};

const darkTheme = {
  background: "#1f2937",
  text: "#f3f4f6",
  primary: "#3b82f6",
  secondary: "#10b981",
  disabled: "#374151",
  hoverPrimary: "#4f46e5",
  hoverSecondary: "#14b8a6",
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 2rem;
  font-family: "Inter", sans-serif;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${(props) => props.theme.disabled};
  padding-bottom: 1rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: ${(props) =>
    props.active ? props.theme.primary : props.theme.background};
  color: ${(props) => (props.active ? "#fff" : props.theme.text)};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: 500;
  box-shadow: ${(props) =>
    props.active ? "0 2px 4px rgba(0,0,0,0.1)" : "none"};

  &:hover {
    background: ${(props) =>
      props.active ? props.theme.hoverPrimary : props.theme.hoverSecondary};
    transform: translateY(-1px);
  }
`;

const UserList = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  min-width: 100px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: ${(props) => props.theme.background};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid ${(props) => props.theme.disabled};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Address = styled.span`
  font-family: "Roboto Mono", monospace;
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
  word-break: break-all;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ActionButton = styled.button<{
  variant?: "primary" | "secondary" | "disabled";
}>`
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  margin-left: 1rem;
  font-weight: 500;
  font-size: 0.9rem;
  min-width: 100px;
  text-align: center;

  ${(props) =>
    props.variant === "primary" &&
    `
    background: ${props.theme.primary};
    color: white;
    &:hover { 
      background: ${props.theme.hoverPrimary};
      transform: translateY(-1px);
    }
  `}

  ${(props) =>
    props.variant === "secondary" &&
    `
    background: ${props.theme.secondary};
    color: white;
    &:hover { 
      background: ${props.theme.hoverSecondary};
      transform: translateY(-1px);
    }
  `}

  ${(props) =>
    props.variant === "disabled" &&
    `
    background: ${props.theme.disabled};
    color: ${props.theme.text}80;
    cursor: not-allowed;
    border: 1px solid ${props.theme.disabled};
  `}
`;

const PendingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PendingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
`;

interface FriendsProps {
  userAddress: string;
  isDarkMode: boolean;
}

const Friends: React.FC<FriendsProps> = ({ userAddress, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<"all" | "friends" | "pending">(
    "all"
  );
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [encryptedUser, setEncryptedUser] = useState("");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("Friends userAddress", userAddress);

      const userData = await fetchUserData(provider, userAddress);
      setEncryptedUser(userData.encryptedAddress);

      // Get both registered and connected users
      const registeredUsers = await getAllRegisteredUsers(provider);
      const connectedUsers = await getAllRegisteredConnectedUsers(provider);

      // Filter out current user from both lists
      const filteredRegisteredUsers = registeredUsers.filter(
        (u) => u !== userData.encryptedAddress
      );
      const filteredConnectedUsers = connectedUsers.filter(
        (u) => u !== userData.encryptedAddress
      );

      // Store both lists
      setAllUsers(filteredRegisteredUsers);
      setConnectedUsers(filteredConnectedUsers);

      console.log("Registered Users:", filteredRegisteredUsers);
      console.log("Connected Users:", filteredConnectedUsers);

      const friendsList = await getFriends(provider, userAddress);
      console.log("Friends friendsList", friendsList);
      setFriends(friendsList);

      // Get both received and sent friend requests
      const [received, sent] = await Promise.all([
        getReceivedFriendRequests(userAddress),
        getSentFriendRequests(userAddress),
      ]);
      console.log("Received requests:", received);
      console.log("Sent requests:", sent);
      setReceivedRequests(received);
      setSentRequests(sent);
    };

    if (userAddress) loadData();
  }, [userAddress]);

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 5)}.....${address.slice(-5)}`;
  };

  const getConnectedAddress = (address: string) => {
    // Check if this registered user has a connected address
    const connectedUser = connectedUsers.find(
      (u) => u.toLowerCase() === address.toLowerCase()
    );
    return connectedUser;
  };

  const handleFollow = async (targetAddress: string) => {
    await sendFriendRequest(userAddress, targetAddress);
    setReceivedRequests((prev) => [...prev, targetAddress]);
  };

  const handleAcceptRequest = async (requesterAddress: string) => {
    await acceptFriendRequest(userAddress, requesterAddress);
    setFriends((prev) => [...prev, requesterAddress]);
    setReceivedRequests((prev) => prev.filter((a) => a !== requesterAddress));
  };

  const getButtonState = (address: string) => {
    if (friends.includes(address)) return "Friends";
    if (receivedRequests.includes(address)) return "Accept";
    if (sentRequests.includes(address)) return "Pending";
    return "Follow";
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Tabs>
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          >
            All Users ({allUsers.length})
          </TabButton>
          <TabButton
            active={activeTab === "friends"}
            onClick={() => setActiveTab("friends")}
          >
            Friends ({friends.length})
          </TabButton>
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({receivedRequests.length + sentRequests.length})
          </TabButton>
        </Tabs>
        <UserList>
          {activeTab === "all" &&
            allUsers.map((user) => {
              const connectedAddress = getConnectedAddress(user);
              return (
                <UserCard key={user}>
                  <Address>
                    {user}
                    {connectedAddress && `(${formatAddress(connectedAddress)})`}
                  </Address>
                  {getButtonState(user) === "Follow" && (
                    <ActionButton
                      variant="primary"
                      onClick={() => handleFollow(user)}
                    >
                      Follow
                    </ActionButton>
                  )}
                  {getButtonState(user) === "Pending" && (
                    <ActionButton variant="disabled">Pending</ActionButton>
                  )}
                  {getButtonState(user) === "Friends" && (
                    <ActionButton variant="disabled">Friends</ActionButton>
                  )}
                </UserCard>
              );
            })}
          {activeTab === "friends" &&
            friends.map((friend) => (
              <UserCard key={friend}>
                <Address>{friend}</Address>
                <ActionButton variant="disabled">Friends</ActionButton>
              </UserCard>
            ))}
          {activeTab === "pending" && (
            <PendingSection>
              <PendingList>
                <PendingTitle>
                  Received Requests ({receivedRequests.length})
                </PendingTitle>
                {receivedRequests.map((request) => (
                  <UserCard key={request}>
                    <Address>{request}</Address>
                    <ActionButton
                      variant="secondary"
                      onClick={() => handleAcceptRequest(request)}
                    >
                      Accept
                    </ActionButton>
                  </UserCard>
                ))}
              </PendingList>
              <PendingList>
                <PendingTitle>
                  Sent Requests ({sentRequests.length})
                </PendingTitle>
                {sentRequests.map((request) => (
                  <UserCard key={request}>
                    <Address>{request}</Address>
                    <ActionButton variant="disabled">Pending</ActionButton>
                  </UserCard>
                ))}
              </PendingList>
            </PendingSection>
          )}
        </UserList>
      </Container>
    </ThemeProvider>
  );
};

export default Friends;
