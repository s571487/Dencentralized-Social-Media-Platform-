// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ModerationValidator {
    enum PostStatus { Clean, UnderReview, Flagged, Cleared }

    struct Report {
        address reporter;
        string contentHash;
        address[] validators;
        mapping(address => bool) hasVoted;
        mapping(address => bool) vote; // true = violation
        uint yesVotes;
        uint noVotes;
        uint createdAt;
        bool resolved;
        PostStatus status;
    }

    uint public constant MAX_VALIDATORS = 3;
    uint public reportCount;
    mapping(uint => Report) public reports;

    event ReportCreated(uint indexed reportId, string contentHash, address reporter);
    event VoteCast(uint indexed reportId, address validator, bool vote);
    event ReportResolved(uint indexed reportId, PostStatus status);

    address[] public validatorPool;

    modifier onlyValidator() {
        require(isValidator(msg.sender), "Not a validator");
        _;
    }

    function addValidator(address _validator) external {
        validatorPool.push(_validator);
    }

    function isValidator(address _addr) public view returns (bool) {
        for (uint i = 0; i < validatorPool.length; i++) {
            if (validatorPool[i] == _addr) return true;
        }
        return false;
    }

    function reportPost(string memory _hash) external {
        require(validatorPool.length >= MAX_VALIDATORS, "Not enough validators");

        address[] memory selected = selectValidators();
        Report storage r = reports[reportCount];
        r.reporter = msg.sender;
        r.contentHash = _hash;
        r.validators = selected;
        r.createdAt = block.timestamp;
        r.status = PostStatus.UnderReview;

        emit ReportCreated(reportCount, _hash, msg.sender);
        reportCount++;
    }

    function vote(uint _id, bool _violation) external onlyValidator {
        Report storage r = reports[_id];
        require(!r.resolved, "Already resolved");
        require(isAssignedValidator(_id, msg.sender), "Not assigned");
        require(!r.hasVoted[msg.sender], "Already voted");

        r.hasVoted[msg.sender] = true;
        r.vote[msg.sender] = _violation;

        if (_violation) r.yesVotes++;
        else r.noVotes++;

        emit VoteCast(_id, msg.sender, _violation);

        if (r.yesVotes + r.noVotes == MAX_VALIDATORS) {
            r.resolved = true;
            r.status = r.yesVotes > r.noVotes ? PostStatus.Flagged : PostStatus.Cleared;

            emit ReportResolved(_id, r.status);
        }
    }

    function selectValidators() internal view returns (address[] memory) {
        address[] memory selected = new address[](MAX_VALIDATORS);
        uint count = 0;
        uint seed = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));

        while (count < MAX_VALIDATORS) {
            address candidate = validatorPool[seed % validatorPool.length];
            bool alreadySelected = false;

            for (uint j = 0; j < count; j++) {
                if (selected[j] == candidate) {
                    alreadySelected = true;
                    break;
                }
            }

            if (!alreadySelected) {
                selected[count] = candidate;
                count++;
            }
            seed++;
        }

        return selected;
    }

    function isAssignedValidator(uint _id, address _validator) internal view returns (bool) {
        address[] memory vals = reports[_id].validators;
        for (uint i = 0; i < vals.length; i++) {
            if (vals[i] == _validator) return true;
        }
        return false;
    }

    function getValidators(uint _id) external view returns (address[] memory) {
        return reports[_id].validators;
    }

    function getPostStatus(uint _id) external view returns (PostStatus) {
        return reports[_id].status;
    }
}
