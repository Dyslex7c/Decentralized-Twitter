import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PostTweetABI from "../contracts/PostTweet.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const useRetrieveTweetsByUser = (userAddress: string) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const loadTweets = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = ethProvider.getSigner();
          const tweetContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            PostTweetABI.abi,
            signer
          );

          const fetchedTweets = await tweetContract.getTweetsByUser(userAddress);
          setTweets(fetchedTweets);
        } catch (error) {
          console.error("Failed to fetch tweets:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadTweets();
  }, [userAddress]);

  return { tweets };
};
