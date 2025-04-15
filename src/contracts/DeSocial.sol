pragma solidity ^0.8.0;

contract DeSocialProfileData {
    struct Post {
        uint256 id;
        address user;
        string description;
        string[] hashtags;
        string mediaHash;
        string cid;
        uint256 likes;
        bool active; 
    }

    struct Comment {
        uint256 postId;
        address commenter;
        string text;
        uint256 timestamp;
    }

    struct FriendRequest {
        address from;
        bool accepted;
    }

    struct Message {
        address sender;
        string text;
        uint256 timestamp;
    }

    // New structs and mappings for validation system
    struct Validator {
        address validatorAddress;
        uint256 stakeTime;
        uint256 wrongDecisions;
        bool active;
    }

    struct Report {
        uint256 postId;
        address[] reporters;
        bool resolved;
        bool removalPending; // Changed from removed to pending
        uint256 reportTime;
        uint256 decisionTime; // Time when decision was made
        mapping(address => bool) validatorVotes;
        uint256 yesVotes;
        uint256 noVotes;
    }

    struct Appeal {
        uint256 postId;
        address[] jurors;
        uint256 appealTime;
        mapping(address => bool) jurorVotes; // Yes = true, No = false
        uint256 yesVotes;
        uint256 noVotes;
        bool resolved;
    }

    uint256 constant public VALIDATOR_STAKE = 0.05 ether;
    uint256 constant public MAX_VALIDATORS = 32;
    uint256 constant public TENURE_PERIOD = 6 * 30 days; // 6 months
    uint256 constant public MIN_REPORTS = 5;
    uint256 constant public VOTING_PERIOD = 24 hours;
    uint256 constant public MAX_WRONG_DECISIONS = 5;
    uint256 constant public APPEAL_JURY_SIZE = 5;
    uint256 constant public APPEAL_PERIOD = 24 hours;
    address[] public registeredConnectedUsers;
    address[] public registeredUsers;
    uint256 public totalUsers;

    mapping(address => Validator) public validators;
    address[] public validatorList;
    mapping(uint256 => Report) public reports;
    mapping(uint256 => Appeal) public appeals;
    

    mapping(address => string) private encryptedAddresses;
    mapping(address => string) private encryptedPrivateKeys;
    mapping(address => bool) public isUserRegistered;

    mapping(address => uint256[]) public userPostIds;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment[]) public postComments;
    mapping(uint256 => mapping(address => bool)) public postLikes;

    mapping(address => mapping(address => FriendRequest)) public friendRequests;
    mapping(address => address[]) public friends;

    mapping(address => mapping(address => Message[])) private messages;
    mapping(address => address[]) private pendingRequestsReceived;

    mapping(address => string) public addressToEncryptedAddress;
mapping(string => address) public encryptedAddressToWallet;
mapping(address => address[]) private pendingRequestsSent;

    uint256 public postCount;

    event UserRegistered(address indexed user);
    event PostCreated(uint256 id, address user, string description, string[] hashtags, string mediaHash, string cid);
    event PostLiked(uint256 id, address user, bool liked);
    event CommentAdded(uint256 id, address user, string text);
    event FriendRequestSent(address from, address to);
    event FriendRequestAccepted(address from, address to);
    event MessageSent(address from, address to, string text);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event PostReported(uint256 indexed postId, address reporter);
    event ValidationVote(uint256 indexed postId, address validator, bool vote);
    event AppealStarted(uint256 indexed postId);
    event AppealVote(uint256 indexed postId, address juror, bool vote);
    event PostRemoved(uint256 indexed postId);
    event PostDeactivated(uint256 indexed postId);
    event PostPermanentlyRemoved(uint256 indexed postId);

    modifier onlyRegistered() {
    require(
        isUserRegistered[msg.sender] || 
        isUserRegistered[encryptedAddressToWallet[encryptedAddresses[msg.sender]]],
        "User not registered"
    );
    _;
}

   // Modified setUserData to track registered users
    function aasetUserData(string memory _encryptedAddress, string memory _encryptedPrivateKey) public {
        require(!isUserRegistered[msg.sender], "Already registered");
        encryptedAddresses[msg.sender] = _encryptedAddress;
        encryptedPrivateKeys[msg.sender] = _encryptedPrivateKey;
        address convertedAddress = parseAddr(_encryptedAddress);
        registeredUsers.push(convertedAddress); 
        isUserRegistered[msg.sender] = true;
        isUserRegistered[convertedAddress] = true;
        registeredConnectedUsers.push(msg.sender);
        totalUsers++; // Increment user count
        emit UserRegistered(msg.sender);
    }

    function getAllRegisteredUsers() public view returns (address[] memory) {
    return registeredUsers;
}

function getAllRegisteredConnectedUsers() public view returns (address[] memory) {
    return registeredConnectedUsers;
}

    function parseAddr(string memory _a) internal pure returns (address) {
    bytes memory tmp = bytes(_a);
    uint160 iaddr = 0;
    uint160 b1;
    uint160 b2;

    for (uint i = 2; i < 2 + 2 * 20; i += 2) {
        iaddr *= 256;
        b1 = uint160(uint8(tmp[i]));
        b2 = uint160(uint8(tmp[i + 1]));
        b1 = b1 >= 97 ? b1 - 87 : b1 >= 65 ? b1 - 55 : b1 - 48;
        b2 = b2 >= 97 ? b2 - 87 : b2 >= 65 ? b2 - 55 : b2 - 48;
        iaddr += (b1 * 16 + b2);
    }
    return address(iaddr);
}



    function getUserData() public view returns (string memory, string memory) {
        require(isUserRegistered[msg.sender], "Not authorized");
        return (encryptedAddresses[msg.sender], encryptedPrivateKeys[msg.sender]);
    }

    function likePost(uint256 postId) public onlyRegistered {
        require(postId > 0 && postId <= postCount, "Invalid post ID");
        bool liked = postLikes[postId][msg.sender];
        if (liked) {
            posts[postId].likes--;
        } else {
            posts[postId].likes++;
        }
        postLikes[postId][msg.sender] = !liked;
        emit PostLiked(postId, msg.sender, !liked);
    }

    function addComment(uint256 postId, string memory text) public onlyRegistered {
        require(postId > 0 && postId <= postCount, "Invalid post ID");
        postComments[postId].push(Comment(postId, msg.sender, text, block.timestamp));
        emit CommentAdded(postId, msg.sender, text);
    }
    

    function sendFriendRequest(address to) public onlyRegistered {
    require(to != msg.sender, "Cannot send request to yourself");
    require(!friendRequests[msg.sender][to].accepted, "Already friends");
    friendRequests[msg.sender][to] = FriendRequest(msg.sender, false);
    pendingRequestsReceived[to].push(msg.sender); // Add to recipient's pending list
    pendingRequestsSent[msg.sender].push(to);     // Add to sender's sent list
    emit FriendRequestSent(msg.sender, to);
}


    function acceptFriendRequest(address from) public onlyRegistered {
    require(friendRequests[from][msg.sender].from == from, "No request found");
    require(!friendRequests[from][msg.sender].accepted, "Already accepted");

    friendRequests[from][msg.sender].accepted = true;
    friends[msg.sender].push(from);
    friends[from].push(msg.sender);
    
    // Remove from recipient's pending list
    _removeFromArray(pendingRequestsReceived[msg.sender], from);
    
    // Remove from sender's sent list
    _removeFromArray(pendingRequestsSent[from], msg.sender);
    
    emit FriendRequestAccepted(from, msg.sender);
}

// Helper function to remove an item from array
function _removeFromArray(address[] storage array, address item) private {
    for (uint i = 0; i < array.length; i++) {
        if (array[i] == item) {
            array[i] = array[array.length - 1];
            array.pop();
            break;
        }
    }
}

// Get requests you've received (existing function)
function getReceivedFriendRequests() public view returns (address[] memory) {
    return pendingRequestsReceived[msg.sender];
}

// New function to get requests you've sent
function getSentFriendRequests() public view returns (address[] memory) {
    return pendingRequestsSent[msg.sender];
}

    function sendMessage(address to, string memory text) public onlyRegistered {
        require(areFriends(msg.sender, to), "Not friends");
        messages[msg.sender][to].push(Message(msg.sender, text, block.timestamp));
        messages[to][msg.sender].push(Message(msg.sender, text, block.timestamp));
        emit MessageSent(msg.sender, to, text);
    }

    function getMessages(address with) public view returns (Message[] memory) {
        require(areFriends(msg.sender, with), "Not friends");
        return messages[msg.sender][with];
    }

    function areFriends(address user1, address user2) public view returns (bool) {
        address[] memory user1Friends = friends[user1];
        for (uint i = 0; i < user1Friends.length; i++) {
            if (user1Friends[i] == user2) return true;
        }
        return false;
    }

    function getFriendRequests() public view returns (address[] memory) {
    return pendingRequestsReceived[msg.sender];
}

    function getFriends(address user) public view returns (address[] memory) {
        return friends[user];
    }

    function getPostComments(uint256 postId) public view returns (Comment[] memory) {
        return postComments[postId];
    }

    function getTotalPosts() public view returns (uint256) {
        return postCount;
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= postCount; i++) {
            if (posts[i].active || posts[i].user == msg.sender) { // Only active or own posts
                allPosts[count] = posts[i];
                count++;
            }
        }
        Post[] memory result = new Post[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = allPosts[i];
        }
        return result;
    }

    function getUserPosts(address user) public view returns (Post[] memory) {
        uint256[] memory postIds = userPostIds[user];
        Post[] memory userPosts = new Post[](postIds.length);
        for (uint256 i = 0; i < postIds.length; i++) {
            userPosts[i] = posts[postIds[i]];
        }
        return userPosts; // Owner can see all their posts regardless of active status
    }
    function becomeValidator() public payable onlyRegistered {
        require(msg.value == VALIDATOR_STAKE, "Incorrect stake amount");
        require(validatorList.length < MAX_VALIDATORS, "Validator slots full");
        require(!validators[msg.sender].active, "Already a validator");

        validators[msg.sender] = Validator(msg.sender, block.timestamp, 0, true);
        validatorList.push(msg.sender);
        emit ValidatorAdded(msg.sender);
    }

    function withdrawStake() public {
        Validator storage v = validators[msg.sender];
        require(v.active, "Not a validator");
        require(block.timestamp >= v.stakeTime + TENURE_PERIOD, "Tenure not complete");
        require(v.wrongDecisions < MAX_WRONG_DECISIONS, "Too many wrong decisions");

        v.active = false;
        payable(msg.sender).transfer(VALIDATOR_STAKE);
        _removeValidator(msg.sender);
    }

    function reportPost(uint256 postId) public onlyRegistered {
        require(postId > 0 && postId <= postCount, "Invalid post ID");
        require(posts[postId].user != address(0), "Post doesn't exist");
        require(posts[postId].active, "Post already inactive");
        Report storage r = reports[postId];
        
        for (uint i = 0; i < r.reporters.length; i++) {
            require(r.reporters[i] != msg.sender, "Already reported");
        }
        
        r.reporters.push(msg.sender);
        emit PostReported(postId, msg.sender);

        if (r.reporters.length >= MIN_REPORTS && !r.resolved) {
            r.postId = postId;
            r.reportTime = block.timestamp;
        }
    }

    function voteOnReport(uint256 postId, bool vote) public {
        require(validators[msg.sender].active, "Not a validator");
        Report storage r = reports[postId];
        require(r.reportTime > 0, "No active report");
        require(block.timestamp <= r.reportTime + VOTING_PERIOD, "Voting period ended");
        require(!r.resolved, "Report already resolved");
        require(!r.validatorVotes[msg.sender], "Already voted");

        r.validatorVotes[msg.sender] = vote;
        if (vote) r.yesVotes++; else r.noVotes++;
        emit ValidationVote(postId, msg.sender, vote);

        if (r.yesVotes + r.noVotes == validatorList.length) {
            _resolveReport(postId);
        }
    }

    function appealDecision(uint256 postId) public onlyRegistered {
        Report storage r = reports[postId];
        require(r.resolved && r.removalPending, "No removable decision");
        require(posts[postId].user == msg.sender, "Not post owner");
        require(block.timestamp <= r.decisionTime + APPEAL_PERIOD, "Appeal period ended");
        require(appeals[postId].appealTime == 0, "Appeal already started");

        Appeal storage a = appeals[postId];
        a.postId = postId;
        a.appealTime = block.timestamp;
        a.jurors = _selectRandomJurors();
        emit AppealStarted(postId);
    }

    // Helper functions
    function _resolveReport(uint256 postId) private {
        Report storage r = reports[postId];
        r.resolved = true;
        r.decisionTime = block.timestamp;
        if (r.yesVotes > r.noVotes) {
            r.removalPending = true;
            posts[postId].active = false;
            emit PostDeactivated(postId);
        }
    }

    function _resolveAppeal(uint256 postId) private {
        Appeal storage a = appeals[postId];
        a.resolved = true;
        Report storage r = reports[postId];
        if (a.yesVotes > a.noVotes) {
            delete posts[postId];
            emit PostPermanentlyRemoved(postId);
        } else {
            posts[postId].active = true;
            r.removalPending = false;
        }
    }

    function _removeValidator(address validator) private {
        for (uint i = 0; i < validatorList.length; i++) {
            if (validatorList[i] == validator) {
                validatorList[i] = validatorList[validatorList.length - 1];
                validatorList.pop();
                break;
            }
        }
    }

    // Check for inactive validators
    function checkInactiveValidators(uint256 postId) public {
        Report storage r = reports[postId];
        if (block.timestamp > r.reportTime + VOTING_PERIOD && !r.resolved) {
            for (uint i = 0; i < validatorList.length; i++) {
                if (!r.validatorVotes[validatorList[i]]) {
                    validators[validatorList[i]].active = false;
                    _removeValidator(validatorList[i]);
                }
            }
            r.resolved = true; // Force resolve if all remaining validators voted
        }
    }

    // Override createPost to check jury duty
    function createPost(string memory description, string[] memory hashtags, string memory mediaHash, string memory cid) 
        public onlyRegistered {
        for (uint i = 1; i <= postCount; i++) {
            Appeal storage a = appeals[i];
            if (a.appealTime > 0 && !a.resolved) {
                for (uint j = 0; j < a.jurors.length; j++) {
                    if (a.jurors[j] == msg.sender && !a.jurorVotes[msg.sender]) {
                        revert("Must vote on appeal first");
                    }
                }
            }
        }
        // Original createPost logic
        postCount++;
        posts[postCount] = Post(postCount, msg.sender, description, hashtags, mediaHash, cid, 0, true); // active = true
        userPostIds[msg.sender].push(postCount);
        emit PostCreated(postCount, msg.sender, description, hashtags, mediaHash, cid);
    }

    // Add these functions after appealDecision
    function getAppealJurors(uint256 postId) public view returns (address[] memory) {
        Appeal storage a = appeals[postId];
        require(a.appealTime > 0, "No appeal for this post");
        return a.jurors;
    }

    // Updated voteOnAppeal to handle partial juror lists
    function voteOnAppeal(uint256 postId, bool vote) public onlyRegistered {
        Appeal storage a = appeals[postId];
        require(a.appealTime > 0, "No active appeal");
        require(block.timestamp <= a.appealTime + VOTING_PERIOD, "Voting period ended");
        require(!a.resolved, "Appeal already resolved");
        
        bool isJuror = false;
        uint256 validJurorCount = 0;
        for (uint i = 0; i < a.jurors.length; i++) {
            if (a.jurors[i] == msg.sender) {
                isJuror = true;
            }
            if (a.jurors[i] != address(0)) {
                validJurorCount++;
            }
        }
        require(isJuror, "Not selected as juror");
        require(!a.jurorVotes[msg.sender], "Already voted");

        a.jurorVotes[msg.sender] = vote;
        if (vote) a.yesVotes++; else a.noVotes++;
        emit AppealVote(postId, msg.sender, vote);

        // Resolve if all valid jurors have voted or no valid jurors exist
        if (validJurorCount > 0 && (a.yesVotes + a.noVotes == validJurorCount)) {
            _resolveAppeal(postId);
        } else if (validJurorCount == 0) {
            // If no valid jurors, reactivate post by default
            posts[postId].active = true;
            reports[postId].removalPending = false;
            a.resolved = true;
        }
    }

    // Modified finalizeRemoval to include juror voting check
    function finalizeRemoval(uint256 postId) public {
        Report storage r = reports[postId];
        require(r.resolved && r.removalPending, "No pending removal");
        require(block.timestamp > r.decisionTime + APPEAL_PERIOD, "Appeal period not ended");
        
        Appeal storage a = appeals[postId];
        require(a.appealTime == 0 || a.resolved, "Appeal in progress");

        delete posts[postId];
        emit PostPermanentlyRemoved(postId);
    }

    // Modified _selectRandomJurors to ensure we get enough jurors
    function _selectRandomJurors() private view returns (address[] memory) {
        address[] memory jurors = new address[](APPEAL_JURY_SIZE);
        uint256 jurorCount = 0;

        // If not enough registered users, return partial list or zeros
        if (totalUsers < APPEAL_JURY_SIZE) {
            for (uint256 i = 0; i < totalUsers; i++) {
                address potentialJuror = registeredUsers[i];
                if (potentialJuror != msg.sender && !validators[potentialJuror].active) {
                    jurors[jurorCount] = potentialJuror;
                    jurorCount++;
                }
            }
            return jurors; // Might have some zeros
        }

        // Select random jurors from registered users
        uint256 attempts = 0;
        uint256 maxAttempts = totalUsers * 2;

        while (jurorCount < APPEAL_JURY_SIZE && attempts < maxAttempts) {
            attempts++;
            uint256 randomIndex = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                msg.sender,
                attempts
            ))) % totalUsers;

            address potentialJuror = registeredUsers[randomIndex];
            if (potentialJuror != msg.sender && 
                !validators[potentialJuror].active && 
                potentialJuror != address(0)) {
                bool alreadySelected = false;
                for (uint256 j = 0; j < jurorCount; j++) {
                    if (jurors[j] == potentialJuror) {
                        alreadySelected = true;
                        break;
                    }
                }
                if (!alreadySelected) {
                    jurors[jurorCount] = potentialJuror;
                    jurorCount++;
                }
            }
        }

        return jurors;
    }

function isActiveValidator(address _address) public view returns (bool) {
    return validators[_address].active;
}
// Function to get IDs of reported posts, accessible only by active validators
function getReportedPostIds() public view returns (uint256[] memory) {
    require(validators[msg.sender].active, "Not an active validator");

    // Temporary array to store all possible post IDs
    uint256[] memory tempIds = new uint256[](postCount);
    uint256 count = 0;

    // Iterate through all posts to find reported ones
    for (uint256 i = 1; i <= postCount; i++) {
        if (reports[i].reportTime > 0) { // Check if post has a report
            tempIds[count] = i;
            count++;
        }
    }

    // Create result array with exact size
    uint256[] memory result = new uint256[](count);
    for (uint256 j = 0; j < count; j++) {
        result[j] = tempIds[j];
    }

    return result;
}

// Function to get a post by its ID
function getPostById(uint256 postId) public view returns (Post memory) {
    require(postId > 0 && postId <= postCount, "Invalid post ID");
    Post memory post = posts[postId];
    require(post.user != address(0), "Post does not exist");
    require(post.active || post.user == msg.sender, "Post is inactive and not owned by caller");
    return post;
}

} 
