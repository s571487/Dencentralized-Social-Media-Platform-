export const contractAddress = "0x82714f94c5E7F1330cB9F51Ee918eC092E5928FA";
export const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "comment",
				"type": "string"
			}
		],
		"name": "commentOnPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ipfsLink",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_hashtags",
				"type": "string[]"
			}
		],
		"name": "createPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "createUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"name": "likePost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "comment",
				"type": "string"
			}
		],
		"name": "NewComment",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsLink",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "NewPost",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "NewUser",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PostEdited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "PostLiked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "activityType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "UserActivityUpdate",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "dailyStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "newUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newComments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newLikes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "activeUsers",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DAY_IN_SECONDS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "getDailyStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "newUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newComments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newLikes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "activeUsers",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "hashtag",
				"type": "string"
			}
		],
		"name": "getHashtagStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlatformStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalComments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalLikes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dailyActiveUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "weeklyActiveUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "monthlyActiveUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastUpdateTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"name": "getPostStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "likeCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "commentCount",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "likedBy",
				"type": "address[]"
			},
			{
				"internalType": "address[]",
				"name": "commentedBy",
				"type": "address[]"
			},
			{
				"internalType": "bool",
				"name": "isEdited",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lastEditTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserPostAnalytics",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "postCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalLikes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalComments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "averageLikesPerPost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "averageCommentsPerPost",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "signUpTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActiveTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "likedPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "commentedPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "postIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "hashtagCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MONTH_IN_SECONDS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalComments",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalLikes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dailyActiveUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "weeklyActiveUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "monthlyActiveUsers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastUpdateTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "postCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "posts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ipfsLink",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "likeCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "commentCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isEdited",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lastEditTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "signUpTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActiveTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "likedPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "commentedPosts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPosts",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "validator",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WEEK_IN_SECONDS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]