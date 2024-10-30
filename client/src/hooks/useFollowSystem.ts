import { useEffect, useState } from "react";
import { Contract, ethers, providers } from "ethers";
import FollowSystemABI from "../contracts/FollowSystem.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const useFollowSystem = () => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const loadTweets = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setProvider(ethProvider);

          const signer = ethProvider.getSigner();
          const followSystemContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            FollowSystemABI.abi,
            signer
          );

          setContract(followSystemContract);
        } catch (error) {
          console.error("Failed to fetch tweets:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadTweets();
  }, []);

  return { contract, provider };
};
