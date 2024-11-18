// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DSMPUserDetails {
    // Struct to hold user details
    struct UserDetails {
        string username;
        string bio;
        string profileImageHash; // IPFS hash of the profile image
        bool isRegistered;
    }

    // Mapping of address to user details
    mapping(address => UserDetails) private users;

    // Event to notify when a user registers or updates details
    event UserRegistered(address indexed userAddress, string username);
    event UserDetailsUpdated(address indexed userAddress, string username);

    // Function to register or update user details
    function registerOrUpdateUser(
        string memory _username,
        string memory _bio,
        string memory _profileImageHash
    ) public {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_bio).length <= 160, "Bio must be 160 characters or less");

        users[msg.sender] = UserDetails({
            username: _username,
            bio: _bio,
            profileImageHash: _profileImageHash,
            isRegistered: true
        });

        if (users[msg.sender].isRegistered) {
            emit UserDetailsUpdated(msg.sender, _username);
        } else {
            emit UserRegistered(msg.sender, _username);
        }
    }

    // Function to retrieve user details
    function getUserDetails(address _userAddress)
        public
        view
        returns (string memory username, string memory bio, string memory profileImageHash)
    {
        require(users[_userAddress].isRegistered, "User not registered");
        UserDetails memory user = users[_userAddress];
        return (user.username, user.bio, user.profileImageHash);
    }

    // Function to check if a user is registered
    function isUserRegistered(address _userAddress) public view returns (bool) {
        return users[_userAddress].isRegistered;
    }
}
