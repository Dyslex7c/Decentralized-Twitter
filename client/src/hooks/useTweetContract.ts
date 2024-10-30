import { useEffect, useState } from "react";
import { ethers, Contract, providers } from "ethers";
import PostTweetABI from "../contracts/PostTweet.json";

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const useTweetContract = () => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const loadContract = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new providers.Web3Provider(window.ethereum);
          setProvider(ethProvider);

          const signer = ethProvider.getSigner();
          const tweetContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            PostTweetABI.abi,
            signer
          );
          setContract(tweetContract);
        } catch (error) {
          console.error("Failed to load provider or contract:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadContract();
  }, []);

  return { contract, provider };
};
