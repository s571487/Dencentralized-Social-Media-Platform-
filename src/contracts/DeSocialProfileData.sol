// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeSocialProfileData {
    mapping(address => string) private encryptedAddresses;
    mapping(address => string) private encryptedPrivateKeys;
    mapping(address => bool) public isUserRegistered;

    function setUserData(string memory _encryptedAddress, string memory _encryptedPrivateKey) public {
        encryptedAddresses[msg.sender] = _encryptedAddress;
        encryptedPrivateKeys[msg.sender] = _encryptedPrivateKey;
        isUserRegistered[msg.sender] = true;
    }

    function getUserData(address user) public view returns (string memory, string memory) {
        return (encryptedAddresses[user], encryptedPrivateKeys[user]);
    }

    function isUserExists(address user) public view returns (bool) {
        return isUserRegistered[user];
    }
}
