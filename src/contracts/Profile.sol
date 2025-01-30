// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EncryptedKeyStorage {
    struct UserKeys {
        string encryptedPublicKey;
        string encryptedPrivateKey;
    }

    mapping(address => UserKeys) private userKeys;

    event KeysStored(address indexed user);

    /// @notice Stores encrypted public and private keys for the sender's address
    /// @param _encryptedPublicKey The encrypted public key
    /// @param _encryptedPrivateKey The encrypted private key
    function storeKeys(string memory _encryptedPublicKey, string memory _encryptedPrivateKey) external {
        userKeys[msg.sender] = UserKeys(_encryptedPublicKey, _encryptedPrivateKey);
        emit KeysStored(msg.sender);
    }

    /// @notice Retrieves encrypted keys for a given user address
    /// @param user The address of the user
    /// @return encryptedPublicKey The encrypted public key
    /// @return encryptedPrivateKey The encrypted private key
    function getKeys(address user) external view returns (string memory encryptedPublicKey, string memory encryptedPrivateKey) {
        require(bytes(userKeys[user].encryptedPublicKey).length > 0, "No keys found for this address");
        return (userKeys[user].encryptedPublicKey, userKeys[user].encryptedPrivateKey);
    }
}
