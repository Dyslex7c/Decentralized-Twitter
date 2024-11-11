import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ExternalProvider } from "@ethersproject/providers";
import { auth } from "../firebase/config";
import axios from "axios";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../state";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
}

const METAMASK_BACKEND_URL = "http://localhost:3001/metamask";
const CLIENT_URL = "http://localhost:3000";

export const useAuth = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  console.log(isWalletConnected);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    const provider = await new GoogleAuthProvider();
    provider.setCustomParameters({
      theme: "dark",
      prompt: "select_account",
    });
    if (window.ethereum && typeof window.ethereum.request !== "undefined") {
      const [userAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsWalletConnected(true);
      const address = ethers.utils.getAddress(userAddress);
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
          console.log(token);
          console.log(user);

          if (token === null || !token) return;
          dispatch(
            setUser({
              user: {
                name: user.displayName || "User",
                avatar:
                  user.photoURL ||
                  "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
                walletAddress: address,
              },
              token: token,
            })
          );
          navigate("/home");
        })
        .catch((err) => {
          const errorCode = err.code;
          const errorMessage = err.message;
          const email = err.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(err);
          console.log(errorCode, errorMessage, email, credential);
        });
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      if (window.ethereum && typeof window.ethereum.request !== "undefined") {
        const [userAddress] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsWalletConnected(true);
        const address = ethers.utils.getAddress(userAddress);
        handleMetaMaskLogin(address);
      } else {
        toast.warn(
          "MetaMask is not installed. Please install MetaMask to sign-up successfully.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            className: "toast-custom",
          }
        );
      }
    } catch (err) {
      console.error("Failed to connect MetaMask and login:", err);
    }
  };

  const getSiweMessage = async (address: string): Promise<string | void> => {
    try {
      const response = await axios.post(
        `${METAMASK_BACKEND_URL}/message`,
        {
          address,
          domain: window.location.hostname || "localhost",
          uri: window.location.origin || CLIENT_URL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err: any) {
      toast.error("Failed to authenticate with MetaMask. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "toast-custom",
      });
      if (err.response) console.error(err.response.data);
      else console.error("Error fetching SIWE message:", err.message);
    }
  };

  const signMessage = async (message: string): Promise<string | void> => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);

      return signature;
    } catch (error) {
      console.error("Failed to sign message:", error);
    }
  };

  const verifySignature = async (
    address: string,
    message: string,
    signature: string
  ): Promise<void> => {
    try {
      const response = await axios.post(`${METAMASK_BACKEND_URL}/verify`, {
        message,
        signature,
      });
      if (response.data.success) {
        toast("Successfully authenticated with MetaMask!");
        dispatch(
          setUser({
            user: {
              name: "Anonymous",
              address: address,
              avatar: "https://cdn-icons-png.flaticon.com/128/10/10960.png",
            },
            token: "jadfkklakssl",
          })
        );
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } else {
        alert("Authentication failed!");
      }
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleMetaMaskLogin = async (address: string) => {
    try {
      const message = await getSiweMessage(address);
      if (!message) {
        throw new Error("Message generation failed");
      }
      const signature = await signMessage(message);
      if (!signature) {
        throw new Error("Signature is required");
      }
      await verifySignature(address, message, signature);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return { handleGoogleAuth, connectWallet };
};
