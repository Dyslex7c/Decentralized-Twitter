// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {PostTweet} from "./PostTweet.sol";

contract PostInteractions {
    PostTweet public postTweet;

    mapping(address => mapping(address => mapping(uint256 => bool)))
        public likes;

    mapping(address => mapping(uint256 => uint256)) public likeCount;

    mapping(address => mapping(address => mapping(uint256 => bool)))
        public bookmarks;

    mapping(address => mapping(uint256 => uint256)) public bookmarkCount;

    struct Comment {
        uint256 id;
        string name;
        address author;
        string authorID;
        string avatar;
        string content;
        string mediaCID;
        uint256 timestamp;
    }

    mapping(address => mapping(uint256 => Comment[])) public comments;

    event TweetLiked(
        address indexed user,
        address indexed author,
        uint256 indexed tweetId
    );
    event TweetUnliked(
        address indexed user,
        address indexed author,
        uint256 indexed tweetId
    );
    event CommentAdded(
        uint256 indexed commentId,
        address indexed commenter,
        address indexed author,
        uint256 tweetId,
        string name,
        string commenterID,
        string avatar,
        string content,
        string mediaCID,
        uint256 timestamp
    );
    event TweetBookmarked(
        address indexed user,
        address indexed author,
        uint256 indexed tweetId
    );
    event TweetUnbookmarked(
        address indexed user,
        address indexed author,
        uint256 indexed tweetId
    );

    uint256 public commentCounter;

    constructor(address _postTweetAddress) {
        postTweet = PostTweet(_postTweetAddress);
    }

    function likeTweet(address author, uint256 tweetId) external {
        require(
            !likes[msg.sender][author][tweetId],
            "You have already liked this tweet"
        );

        likes[msg.sender][author][tweetId] = true;
        likeCount[author][tweetId] += 1;

        emit TweetLiked(msg.sender, author, tweetId);
    }

    function unlikeTweet(address author, uint256 tweetId) external {
        require(
            likes[msg.sender][author][tweetId],
            "You have not liked this tweet."
        );

        likes[msg.sender][author][tweetId] = false;
        likeCount[author][tweetId] -= 1;

        emit TweetUnliked(msg.sender, author, tweetId);
    }

    function getTotalLikes(
        address author,
        uint256 tweetId
    ) external view returns (uint256) {
        return likeCount[author][tweetId];
    }

    function isLiked(
        address author,
        uint256 tweetId
    ) external view returns (bool) {
        return likes[msg.sender][author][tweetId];
    }

    function addComment(
        address author,
        uint256 tweetId,
        string calldata _name,
        string calldata _commenterID,
        string calldata _avatar,
        string calldata _content,
        string calldata _mediaCID
    ) external {
        require(bytes(_content).length > 0, "Comment cannot be empty");

        Comment memory newComent = Comment({
            id: commentCounter,
            name: _name,
            author: msg.sender,
            authorID: _commenterID,
            avatar: _avatar,
            content: _content,
            mediaCID: _mediaCID,
            timestamp: block.timestamp
        });

        comments[author][tweetId].push(newComent);

        emit CommentAdded(
            commentCounter,
            msg.sender,
            author,
            tweetId,
            _name,
            _commenterID,
            _avatar,
            _content,
            _mediaCID,
            block.timestamp
        );

        commentCounter++;
    }

    function getComments(
        address author,
        uint256 tweetId
    ) external view returns (Comment[] memory) {
        return comments[author][tweetId];
    }

    function getTotalComments(
        address author,
        uint256 tweetId
    ) external view returns (uint256) {
        return comments[author][tweetId].length;
    }

    function hasUserCommented(
        address author,
        uint256 tweetId
    ) external view returns (bool) {
        Comment[] memory tweetComments = comments[author][tweetId];
        for (uint256 i = 0; i < tweetComments.length; i++) {
            if (tweetComments[i].author == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function bookmarkTweet(address author, uint256 tweetId) external {
        require(
            !bookmarks[msg.sender][author][tweetId],
            "You have already bookmarked this tweet"
        );

        bookmarks[msg.sender][author][tweetId] = true;
        bookmarkCount[author][tweetId] += 1;

        emit TweetBookmarked(msg.sender, author, tweetId);
    }

    function unbookmarkTweet(address author, uint256 tweetId) external {
        require(
            bookmarks[msg.sender][author][tweetId],
            "You have not bookmarked this tweet"
        );

        bookmarks[msg.sender][author][tweetId] = false;
        bookmarkCount[author][tweetId] -= 1;

        emit TweetUnbookmarked(msg.sender, author, tweetId);
    }

    function getTotalBookmarks(
        address author,
        uint256 tweetId
    ) external view returns (uint256) {
        return bookmarkCount[author][tweetId];
    }

    function hasUserBookmarked(
        address author,
        uint256 tweetId
    ) external view returns (bool) {
        return bookmarks[msg.sender][author][tweetId];
    }
}
