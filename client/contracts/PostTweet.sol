// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {FollowSystem} from "./FollowSystem.sol";

contract PostTweet {
    FollowSystem public followSystem;

    constructor(address _followSystemAddress) {
        followSystem = FollowSystem(_followSystemAddress);
    }

    struct Tweet {
        uint256 id;
        string name;
        address author;
        string authorID;
        string avatar;
        string content;
        string mediaCID;
        uint256 timestamp;
    }

    Tweet[] public allTweets;
    mapping(address => Tweet[]) public userTweets;

    uint256 public tweetCounter;

    event TweetPosted(
        uint256 indexed tweetId,
        address indexed author,
        string authorID,
        string name,
        string avatar,
        string content,
        string mediaCID,
        uint256 timestamp
    );

    function postTweet(
        string memory _name,
        string memory _authorID,
        string memory _avatar,
        string memory _content,
        string memory _mediaCID
    ) public {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");

        Tweet memory newTweet = Tweet({
            id: tweetCounter,
            name: _name,
            author: msg.sender,
            authorID: _authorID,
            avatar: _avatar,
            content: _content,
            mediaCID: _mediaCID,
            timestamp: block.timestamp
        });

        allTweets.push(newTweet);
        userTweets[msg.sender].push(newTweet);

        emit TweetPosted(
            tweetCounter,
            msg.sender,
            _authorID,
            _name,
            _avatar,
            _content,
            _mediaCID,
            block.timestamp
        );

        tweetCounter++;
    }

    function getAllTweets() public view returns (Tweet[] memory) {
        return allTweets;
    }

    function getTweetsByUser(
        address _user
    ) public view returns (Tweet[] memory) {
        return userTweets[_user];
    }

    function getTweetsByFollowing() public view returns (Tweet[] memory) {
        address[] memory followedPersons = followSystem.getFollowing(
            msg.sender
        );

        uint256 totalTweetCount = 0;

        for (uint i = 0; i < followedPersons.length; i++) {
            totalTweetCount += userTweets[followedPersons[i]].length;
        }

        Tweet[] memory allFollowedTweets = new Tweet[](totalTweetCount);

        uint256 currentIndex = 0;
        for (uint i = 0; i < followedPersons.length; i++) {
            Tweet[] memory tweets = userTweets[followedPersons[i]];
            for (uint j = 0; j < tweets.length; j++) {
                allFollowedTweets[currentIndex] = tweets[j];
                currentIndex++;
            }
        }

        return allFollowedTweets;
    }
}
