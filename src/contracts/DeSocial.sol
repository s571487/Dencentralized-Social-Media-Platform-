// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeSocialProfileData {
    mapping(address => string) private encryptedAddresses;
    mapping(address => string) private encryptedPrivateKeys;
    mapping(address => bool) public isUserRegistered;
    mapping(address => uint256[]) public userPostIds;
    mapping(uint256 => Post) public posts;
    mapping(address => FriendRequest[]) public friendRequests;
    mapping(address => address[]) public friends;
    mapping(uint256 => mapping(address => bool)) public postLikes;

    struct Post {
        uint256 id;
        address user;
        string description;
        string[] hashtags;
        string mediaHash;
        string cid;
        uint256 likes;
    }

    struct Comment {
        uint256 postId;
        address commenter;
        string text;
    }

    struct FriendRequest {
        address from;
        address to;
        bool accepted;
    }

    uint256 public postCount;
    mapping(uint256 => Comment[]) public postComments;

    event PostCreated(
        uint256 id,
        address user,
        string description,
        string[] hashtags,
        string mediaHash,
        string cid
    );
    event PostLiked(uint256 id, address user, bool liked);
    event CommentAdded(uint256 id, address user, string text);
    event FriendRequestSent(address from, address to);
    event FriendRequestAccepted(address from, address to);

    function setUserData(
        string memory _encryptedAddress,
        string memory _encryptedPrivateKey
    ) public {
        encryptedAddresses[msg.sender] = _encryptedAddress;
        encryptedPrivateKeys[msg.sender] = _encryptedPrivateKey;
        isUserRegistered[msg.sender] = true;
    }

    function getUserData(address user)
        public
        view
        returns (string memory, string memory)
    {
        return (encryptedAddresses[user], encryptedPrivateKeys[user]);
    }

    function isUserExists(address user) public view returns (bool) {
        return isUserRegistered[user];
    }

    function createPost(
        string memory description,
        string[] memory hashtags,
        string memory mediaHash,
        string memory cid
    ) public {
        postCount++;
        Post storage newPost = posts[postCount];
        newPost.id = postCount;
        newPost.user = msg.sender;
        newPost.description = description;
        newPost.hashtags = hashtags;
        newPost.mediaHash = mediaHash;
        newPost.cid = cid;
        newPost.likes = 0;
        userPostIds[msg.sender].push(postCount);
        emit PostCreated(
            postCount,
            msg.sender,
            description,
            hashtags,
            mediaHash,
            cid
        );
    }

    function likePost(uint256 postId) public {
        Post storage post = posts[postId];
        bool liked = postLikes[postId][msg.sender];
        if (liked) {
            post.likes--;
            postLikes[postId][msg.sender] = false;
        } else {
            post.likes++;
            postLikes[postId][msg.sender] = true;
        }
        emit PostLiked(postId, msg.sender, !liked);
    }

    function addComment(uint256 postId, string memory text) public {
        postComments[postId].push(Comment(postId, msg.sender, text));
        emit CommentAdded(postId, msg.sender, text);
    }

    function sendFriendRequest(address to) public {
        friendRequests[msg.sender].push(FriendRequest(msg.sender, to, false));
        emit FriendRequestSent(msg.sender, to);
    }

    function acceptFriendRequest(address from) public {
        for (uint256 i = 0; i < friendRequests[from].length; i++) {
            if (
                friendRequests[from][i].to == msg.sender &&
                !friendRequests[from][i].accepted
            ) {
                friendRequests[from][i].accepted = true;
                friends[msg.sender].push(from);
                friends[from].push(msg.sender);
                emit FriendRequestAccepted(from, msg.sender);
                break;
            }
        }
    }

    function getFriends(address user) public view returns (address[] memory) {
        return friends[user];
    }

    function getFriendRequests(address user)
        public
        view
        returns (FriendRequest[] memory)
    {
        return friendRequests[user];
    }

    function getPostComments(uint256 postId)
        public
        view
        returns (Comment[] memory)
    {
        return postComments[postId];
    }

    function getTotalPosts() public view returns (uint256) {
        return postCount;
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            allPosts[i-1] = posts[i];
        }
        return allPosts;
    }

    function getUserPosts(address user) public view returns (Post[] memory) {
        uint256[] memory postIds = userPostIds[user];
        Post[] memory userPosts = new Post[](postIds.length);
        for (uint256 i = 0; i < postIds.length; i++) {
            userPosts[i] = posts[postIds[i]];
        }
        return userPosts;
    }

    function getUserFriends(address user) public view returns (address[] memory) {
        return friends[user];
    }
}
