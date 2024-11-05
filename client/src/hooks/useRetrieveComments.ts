import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PostInteractionsABI from "../contracts/PostInteractions.json";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const useRetrieveComments = (userAddress: string, tweetId: string) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          const signer = ethProvider.getSigner();
          const PostInteractionsContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            PostInteractionsABI.abi,
            signer
          );

          const fetchedComments = await PostInteractionsContract.getComments(
            userAddress,
            tweetId
          );
          setComments(fetchedComments);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadComments();
  }, [userAddress, tweetId]);

  return { comments };
};
