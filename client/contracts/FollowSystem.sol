// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

/**
 * @title FollowSystem
 * @author Ritesh Das
 * @notice This contract enables a follow/unfollow system where users can follow each other.
 * @dev Followers are tracked using mappings, and events are emitted for follow/unfollow actions.
 */
contract FollowSystem {
    mapping(address => mapping(address => bool)) public followers;
    mapping(address => address[]) public followingList;
    mapping(address => address[]) public followerList;

    event Followed(address indexed follower, address indexed followedPerson);
    event Unfollowed(address indexed follower, address indexed followedPerson);

    /**
     * @notice Allows a user to follow another user
     * @param _followedPerson The address of the user to follow
     */
    function follow(address _followedPerson) public {
        require(_followedPerson != msg.sender, "Cannot follow yourself");
        require(!followers[msg.sender][_followedPerson], "Already following");

        followers[msg.sender][_followedPerson] = true;
        followingList[msg.sender].push(_followedPerson);
        followerList[_followedPerson].push(msg.sender);

        emit Followed(msg.sender, _followedPerson);
    }

    /**
     * @notice Allows a user to unfollow another user
     * @param _followedPerson The address of the user to unfollow
     */
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

    /**
     * @notice Checks if a user is following another user
     * @param _follower The address of the follower
     * @param _followedPerson The address of the followed person
     * @return A boolean value based on whether the user is following that person or not
     */
    function isFollowing(
        address _follower,
        address _followedPerson
    ) public view returns (bool) {
        return followers[_follower][_followedPerson];
    }

    /**
     * @notice Retrieves a list of addresses the user is following
     * @param _user The address of the user
     * @return Array of addresses the user is following
     */
    function getFollowing(
        address _user
    ) public view returns (address[] memory) {
        return followingList[_user];
    }

    /**
     * @notice Retrieves a list of addresses who are following the user
     * @param _user The address of the user
     * @return Array of addresses who are following the user
     */
    function getFollowers(
        address _user
    ) public view returns (address[] memory) {
        return followerList[_user];
    }
}
