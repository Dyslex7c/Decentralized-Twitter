import { useEffect, useState } from "react";
import { ethers } from "ethers";
import FollowSystemABI from "../contracts/FollowSystem.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const useRetrieveFollowingList = (userAddress: string) => {
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    const loadFollowingList = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          const signer = ethProvider.getSigner();
          const followSystemContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            FollowSystemABI.abi,
            signer
          );

          const fetchedFollowingList = await followSystemContract.getFollowing(
            userAddress
          );
          setFollowingList(fetchedFollowingList);
        } catch (error) {
          console.error("Failed to fetch following list:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadFollowingList();
  }, [userAddress]);

  return { followingList };
};

export const useRetrieveFollowerList = (userAddress: string) => {
  const [followerList, setFollowerList] = useState([]);

  useEffect(() => {
    const loadFollowerList = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          const signer = ethProvider.getSigner();
          const followSystemContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            FollowSystemABI.abi,
            signer
          );

          const fetchedFollowerList = await followSystemContract.getFollowers(
            userAddress
          );
          setFollowerList(fetchedFollowerList);
        } catch (error) {
          console.error("Failed to fetch following list:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadFollowerList();
  }, [userAddress]);

  return { followerList };
};
