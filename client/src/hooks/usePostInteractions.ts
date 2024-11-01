import { useEffect, useState } from "react";
import { Contract, ethers, providers } from "ethers";
import PostInteractionsABI from "../contracts/PostInteractions.json";

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const usePostInteractions = () => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
    
  useEffect(() => {
    const loadPostInteractionsContract = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setProvider(ethProvider);

          const signer = ethProvider.getSigner();
          const postInteractionsContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            PostInteractionsABI.abi,
            signer
          );

          setContract(postInteractionsContract);
        } catch (error) {
          console.error("Failed to fetch contract:", error);
        }
      } else {
        console.error("Ethereum provider not found.");
      }
    };

    loadPostInteractionsContract();
  }, []);

  return { contract, provider };
};
