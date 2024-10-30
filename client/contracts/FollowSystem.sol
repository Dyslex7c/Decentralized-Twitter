// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract FollowSystem {
    mapping(address => mapping(address => bool)) public followers;
    mapping(address => address[]) public followingList;
    mapping(address => address[]) public followerList;

    event Followed(address indexed follower, address indexed followedPerson);
    event Unfollowed(address indexed follower, address indexed followedPerson);

    function follow(address _followedPerson) public {
        require(_followedPerson != msg.sender, "Cannot follow yourself");
        require(!followers[msg.sender][_followedPerson], "Already following");

        followers[msg.sender][_followedPerson] = true;
        followingList[msg.sender].push(_followedPerson);
        followerList[_followedPerson].push(msg.sender);

        emit Followed(msg.sender, _followedPerson);
    }

    function unfollow(address _followedPerson) public {
        require(followers[msg.sender][_followedPerson], "Not following");

        followers[msg.sender][_followedPerson] = false;

        for (uint i = 0; i < followingList[msg.sender].length; i++) {
            if (followingList[msg.sender][i] == _followedPerson) {
                followingList[msg.sender][i] = followingList[msg.sender][
                    followingList[msg.sender].length - 1
                ];
                followingList[msg.sender].pop();
                break;
            }
        }

        for (uint i = 0; i < followerList[_followedPerson].length; i++) {
            if (followerList[_followedPerson][i] == msg.sender) {
                followerList[_followedPerson][i] = followerList[
                    _followedPerson
                ][followerList[_followedPerson].length - 1];
                followerList[_followedPerson].pop();
                break;
            }
        }

        emit Unfollowed(msg.sender, _followedPerson);
    }

    function isFollowing(
        address _follower,
        address _followedPerson
    ) public view returns (bool) {
        return followers[_follower][_followedPerson];
    }

    function getFollowing(
        address _user
    ) public view returns (address[] memory) {
        return followingList[_user];
    }

    function getFollowers(
        address _user
    ) public view returns (address[] memory) {
        return followerList[_user];
    }
}
