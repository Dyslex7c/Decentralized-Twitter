// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PostTweet {
    struct Tweet {
        uint256 id;
        address author;
        string content;
        string mediaCID;
        uint256 timestamp;
    }

    mapping(address => Tweet[]) public userTweets;

    uint256 public tweetCounter;

    event TweetPosted(
        uint256 indexed tweetId,
        address indexed author,
        string content,
        string mediaCID,
        uint256 timestamp
    );

    function postTweet(string memory _content, string memory _mediaCID) public {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");

        Tweet memory newTweet = Tweet({
            id: tweetCounter,
            author: msg.sender,
            content: _content,
            mediaCID: _mediaCID,
            timestamp: block.timestamp
        });

        userTweets[msg.sender].push(newTweet);

        emit TweetPosted(
            tweetCounter,
            msg.sender,
            _content,
            _mediaCID,
            block.timestamp
        );

        tweetCounter++;
    }

    function getTweetsByUser(address _user) public view returns (Tweet[] memory) {
        return userTweets[_user];
    }
}
