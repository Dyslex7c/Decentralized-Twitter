// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {PostTweet} from "./PostTweet.sol";

contract PostInteractions {
    PostTweet public postTweet;

    mapping(address => mapping(address => mapping(uint256 => bool))) public likes;

    mapping(address => mapping(uint256 => uint256)) public likeCount;

    event TweetLiked(address indexed user, address indexed author, uint256 indexed tweetId);
    event TweetUnliked(address indexed user, address indexed author, uint256 indexed tweetId);

    constructor(address _postTweetAddress) {
        postTweet = PostTweet(_postTweetAddress);
    }

    function likeTweet(address author, uint256 tweetId) external {
        require(!likes[msg.sender][author][tweetId], "You have already liked this tweet");

        likes[msg.sender][author][tweetId] = true;
        likeCount[author][tweetId] += 1;

        emit TweetLiked(msg.sender, author, tweetId);
    }

    function unlikeTweet(address author, uint256 tweetId) external {
        require(likes[msg.sender][author][tweetId], "You have not liked this tweet.");

        likes[msg.sender][author][tweetId] = false;
        likeCount[author][tweetId] -= 1;

        emit TweetUnliked(msg.sender, author, tweetId);
    }

    function getTotalLikes(address author, uint256 tweetId) external view returns (uint256) {
        return likeCount[author][tweetId];
    }

    function isLiked(address author, uint256 tweetId) external view returns (bool) {
        return likes[msg.sender][author][tweetId];
    }
}