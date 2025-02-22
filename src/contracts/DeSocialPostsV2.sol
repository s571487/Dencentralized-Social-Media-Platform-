// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    struct Comment {
        address user;
        string text;
    }

    uint public nextPostId;
    mapping(uint => Post) private posts;
    uint[] private postIds;
    mapping(address => uint[]) private userPosts;

    // Mapping for likes: post ID to a list of users who liked it.
    mapping(uint => mapping(address => bool)) public postLikes;
    // Mapping for comments: post ID to a list of comments.
    mapping(uint => Comment[]) public postComments;

    event PostCreated(uint id, address user, string cid);
    event PostEdited(uint id, string newCid);
    event PostDeleted(uint id);
    event PostLiked(uint postId, address user);
    event PostUnliked(uint postId, address user);
    event CommentAdded(uint postId, address user, string text);

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

    function getPostsByUser(address _user) public view returns (Post[] memory) {
        address associated;
        address gen = profileData.generatedAddressFor(_user);
        address conn = profileData.connectedAddressFor(_user);
        if (gen != address(0) && gen != _user) {
            associated = gen;
        } else if (conn != address(0) && conn != _user) {
            associated = conn;
        }

        uint count = 0;
        uint[] memory postsUser = userPosts[_user];
        for (uint i = 0; i < postsUser.length; i++) {
            if (posts[postsUser[i]].active) {
                count++;
            }
        }
        if (associated != address(0)) {
            uint[] memory postsAssoc = userPosts[associated];
            for (uint i = 0; i < postsAssoc.length; i++) {
                if (posts[postsAssoc[i]].active) {
                    count++;
                }
            }
        }

        Post[] memory result = new Post[](count);
        uint j = 0;
        for (uint i = 0; i < postsUser.length; i++) {
            if (posts[postsUser[i]].active) {
                result[j] = posts[postsUser[i]];
                j++;
            }
        }
        if (associated != address(0)) {
            uint[] memory postsAssoc = userPosts[associated];
            for (uint i = 0; i < postsAssoc.length; i++) {
                if (posts[postsAssoc[i]].active) {
                    result[j] = posts[postsAssoc[i]];
                    j++;
                }
            }
        }
        return result;
    }

    function getAllPosts() public view returns (Post[] memory) {
        uint count = 0;
        for (uint i = 0; i < postIds.length; i++) {
            if (posts[postIds[i]].active) {
                count++;
            }
        }
        Post[] memory result = new Post[](count);
        uint j = 0;
        for (uint i = 0; i < postIds.length; i++) {
            if (posts[postIds[i]].active) {
                result[j] = posts[postIds[i]];
                j++;
            }
        }
        return result;
    }

    function editPost(uint _postId, string memory _newCid) public {
        require(posts[_postId].user == msg.sender, "Not the post owner");
        require(posts[_postId].active, "Post does not exist or is deleted");
        posts[_postId].cid = _newCid;
        emit PostEdited(_postId, _newCid);
    }

    function deletePost(uint _postId) public {
        require(posts[_postId].user == msg.sender, "Not the post owner");
        require(posts[_postId].active, "Post already deleted");
        posts[_postId].active = false;
        emit PostDeleted(_postId);
    }

    // Add a like to a post.
    function likePost(uint _postId) public {
        require(posts[_postId].active, "Post is deleted");
        require(!postLikes[_postId][msg.sender], "Already liked this post");
        
        postLikes[_postId][msg.sender] = true;
        emit PostLiked(_postId, msg.sender);
    }

    // Remove a like from a post.
    function unlikePost(uint _postId) public {
        require(posts[_postId].active, "Post is deleted");
        require(postLikes[_postId][msg.sender], "You haven't liked this post");

        postLikes[_postId][msg.sender] = false;
        emit PostUnliked(_postId, msg.sender);
    }

    // Add a comment to a post.
    function addComment(uint _postId, string memory _text) public {
        require(posts[_postId].active, "Post is deleted");

        postComments[_postId].push(Comment(msg.sender, _text));
        emit CommentAdded(_postId, msg.sender, _text);
    }

    // Retrieve all comments for a specific post.
    function getComments(uint _postId) public view returns (Comment[] memory) {
        return postComments[_postId];
    }

    // Check if the user has liked a post.
    function hasLiked(uint _postId, address _user) public view returns (bool) {
        return postLikes[_postId][_user];
    }
}