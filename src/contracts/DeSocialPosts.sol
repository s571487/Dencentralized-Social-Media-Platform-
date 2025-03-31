// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Minimal interface to interact with the DSMP profile contract.
interface IDeSocialProfileData {
    function generatedAddressFor(address user) external view returns (address);
    function connectedAddressFor(address user) external view returns (address);
}

contract DeSocialPosts {
    IDeSocialProfileData public profileData;

    struct Post {
        uint id;
        address user;
        string cid;
        bool active;
    }
    
    struct Message {
        uint id;
        address sender;
        address receiver;
        string cid;
        uint timestamp;
        bool active;
    }
    
    uint public nextPostId;
    uint public nextMessageId;
    
    mapping(uint => Post) private posts;
    uint[] private postIds;
    mapping(address => uint[]) private userPosts;
    
    mapping(uint => Message) private messages;
    mapping(address => uint[]) private userMessages;
    
    event PostCreated(uint id, address user, string cid);
    event PostEdited(uint id, string newCid);
    event PostDeleted(uint id);
    
    event MessageSent(uint id, address sender, address receiver, string cid);
    event MessageDeleted(uint id);

    constructor(address profileDataAddress) {
        profileData = IDeSocialProfileData(profileDataAddress);
    }
    
    function createPost(string memory _cid) public returns (uint postId) {
        postId = nextPostId;
        posts[postId] = Post(postId, msg.sender, _cid, true);
        postIds.push(postId);
        userPosts[msg.sender].push(postId);
        nextPostId++;
        emit PostCreated(postId, msg.sender, _cid);
    }
    
    function sendMessage(address _receiver, string memory _cid) public returns (uint messageId) {
        messageId = nextMessageId;
        messages[messageId] = Message(messageId, msg.sender, _receiver, _cid, block.timestamp, true);
        userMessages[msg.sender].push(messageId);
        userMessages[_receiver].push(messageId);
        nextMessageId++;
        emit MessageSent(messageId, msg.sender, _receiver, _cid);
    }
    
    function getMessages(address _user) public view returns (Message[] memory) {
        uint count = 0;
        uint[] memory userMsgs = userMessages[_user];
        for (uint i = 0; i < userMsgs.length; i++) {
            if (messages[userMsgs[i]].active) {
                count++;
            }
        }
        Message[] memory result = new Message[](count);
        uint j = 0;
        for (uint i = 0; i < userMsgs.length; i++) {
            if (messages[userMsgs[i]].active) {
                result[j] = messages[userMsgs[i]];
                j++;
            }
        }
        return result;
    }
    
    function deleteMessage(uint _messageId) public {
        require(messages[_messageId].sender == msg.sender, "Not the sender");
        require(messages[_messageId].active, "Message already deleted");
        messages[_messageId].active = false;
        emit MessageDeleted(_messageId);
    }
}
