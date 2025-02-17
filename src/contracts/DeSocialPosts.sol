// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Minimal interface to interact with the DSMP profile contract.
interface IDeSocialProfileData {
    function generatedAddressFor(address user) external view returns (address);
    function connectedAddressFor(address user) external view returns (address);
}

contract DeSocialPosts {
    IDeSocialProfileData public profileData;

    // Each post contains an id, the creator's address, the IPFS CID, and an active flag.
    struct Post {
        uint id;
        address user;
        string cid;
        bool active;
    }
    
    uint public nextPostId;
    // Mapping from post id to post details.
    mapping(uint => Post) private posts;
    // Global list of post ids.
    uint[] private postIds;
    // Mapping from user address to an array of post ids they created.
    mapping(address => uint[]) private userPosts;
    
    // Events for off-chain indexing.
    event PostCreated(uint id, address user, string cid);
    event PostEdited(uint id, string newCid);
    event PostDeleted(uint id);

    /// @notice Constructor takes the DSMP profile contract address.
    /// @param profileDataAddress The address of the deployed DeSocialProfileData contract.
    constructor(address profileDataAddress) {
        profileData = IDeSocialProfileData(profileDataAddress);
    }
    
    /// @notice Create a new post with the given IPFS CID.
    /// @param _cid The IPFS CID pointing to the post data.
    /// @return postId The unique id for the created post.
    function createPost(string memory _cid) public returns (uint postId) {
        postId = nextPostId;
        posts[postId] = Post(postId, msg.sender, _cid, true);
        postIds.push(postId);
        userPosts[msg.sender].push(postId);
        nextPostId++;
        emit PostCreated(postId, msg.sender, _cid);
    }
    
    /// @notice Retrieve all active posts for a user from both their connected and generated addresses.
    /// @param _user Either the connected or generated address.
    /// @return An array of active posts associated with the user.
    function getPostsByUser(address _user) public view returns (Post[] memory) {
        // Determine the associated address.
        // If _user is the connected address, get the generated address.
        // If _user is the generated address, get the connected address.
        address associated;
        address gen = profileData.generatedAddressFor(_user);
        address conn = profileData.connectedAddressFor(_user);
        if (gen != address(0) && gen != _user) {
            associated = gen;
        } else if (conn != address(0) && conn != _user) {
            associated = conn;
        }
        
        // Count active posts for _user.
        uint count = 0;
        uint[] memory postsUser = userPosts[_user];
        for (uint i = 0; i < postsUser.length; i++) {
            if (posts[postsUser[i]].active) {
                count++;
            }
        }
        // Count active posts for the associated address (if any).
        if (associated != address(0)) {
            uint[] memory postsAssoc = userPosts[associated];
            for (uint i = 0; i < postsAssoc.length; i++) {
                if (posts[postsAssoc[i]].active) {
                    count++;
                }
            }
        }
        
        // Combine posts into one array.
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
    
    /// @notice Retrieve all active posts (from any user).
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
    
    /// @notice Edit an existing post’s IPFS CID.
    /// @param _postId The id of the post to edit.
    /// @param _newCid The new IPFS CID.
    function editPost(uint _postId, string memory _newCid) public {
        require(posts[_postId].user == msg.sender, "Not the post owner");
        require(posts[_postId].active, "Post does not exist or is deleted");
        posts[_postId].cid = _newCid;
        emit PostEdited(_postId, _newCid);
    }
    
    /// @notice "Delete" a post by marking it inactive.
    /// @param _postId The id of the post to delete.
    function deletePost(uint _postId) public {
        require(posts[_postId].user == msg.sender, "Not the post owner");
        require(posts[_postId].active, "Post already deleted");
        posts[_postId].active = false;
        emit PostDeleted(_postId);
    }
}
