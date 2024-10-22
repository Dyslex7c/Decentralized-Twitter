import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import googlelogo from "../assets/google.png";
import metamasklogo from "../assets/metamask.png";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ExternalProvider } from "@ethersproject/providers";
import { auth } from "../firebase/config";
import axios from "axios";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
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

const LoginPage = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [address, setAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  console.log(isWalletConnected);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleRegisterModal = () => {
    setRegisterModal(!registerModal);
  };

  const toggleLoginModal = () => {
    setLoginModal(!loginModal);
  };

  const handleGoogleAuth = async () => {
    const provider = await new GoogleAuthProvider();
    provider.setCustomParameters({
      theme: "dark",
      prompt: "select_account",
    });
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
              avatar: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
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
  };

  const connectWallet = async (): Promise<void> => {
    try {
      if (window.ethereum && typeof window.ethereum.request !== "undefined") {
        const [userAddress] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsWalletConnected(true);
        setAddress(ethers.utils.getAddress(userAddress));
        handleMetaMaskLogin();
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

  const getSiweMessage = async (): Promise<string | void> => {
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

  const handleMetaMaskLogin = async () => {
    try {
      const message = await getSiweMessage();
      if (!message) {
        throw new Error("Message generation failed");
      }
      const signature = await signMessage(message);
      if (!signature) {
        throw new Error("Signature is required");
      }
      await verifySignature(message, signature);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      {registerModal && (
        <RegisterModal
          toggleRegisterModal={toggleRegisterModal}
          isVisible={registerModal}
        />
      )}
      {loginModal && (
        <LoginModal
          toggleLoginModal={toggleLoginModal}
          isVisible={loginModal}
        />
      )}
      <div className="w-full h-screen flex flex-row p-2">
        <ToastContainer
          bodyClassName={() =>
            "text-sm text-black font-white font-med block p-3"
          }
        />
        <div className="w-1/2 h-screen flex items-center justify-center">
          <img src={logo} alt="logo" />
        </div>
        <div className="w-1/2 h-screen flex items-center justify-center">
          <div className="flex flex-col items-start">
            <div
              className="text-7xl p-4 m-2"
              style={{ fontFamily: "Bebas Neue" }}
            >
              Decentralize your voice
            </div>
            <div
              className="text-3xl p-4 m-2"
              style={{ fontFamily: "Prompt", fontWeight: 600 }}
            >
              Get started today
            </div>
            <div className="flex flex-col px-4 m-2 gap-y-2">
              <button
                onClick={handleGoogleAuth}
                className="bg-white hover:bg-[#78c7ff] transtion duration-300 ease-in-out text-black p-3 px-16 rounded-full flex items-center gap-2"
              >
                <img src={googlelogo} width={20} alt="google" />
                <span
                  className="text-sm"
                  style={{ fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Sign up with Google
                </span>
              </button>
              <button
                onClick={connectWallet}
                className="bg-white hover:bg-[#59ffa1] transtion duration-300 ease-in-out text-black p-3 px-16 mb-6 rounded-full flex items-center gap-2"
              >
                <img src={metamasklogo} width={20} alt="metamask" />
                <span
                  className="text-sm"
                  style={{ fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Sign up with MetaMask
                </span>
              </button>
              <button
                className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition duration-300 ease-in-out text-white p-3 px-16 rounded-full flex items-center justify-center gap-2"
                onClick={toggleRegisterModal}
              >
                <span
                  className="text-sm"
                  style={{ fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Register
                </span>
              </button>
              <p className="p-3 text-sm" style={{ fontFamily: "Poppins" }}>
                Already have an Account?{" "}
                <span
                  onClick={toggleLoginModal}
                  className="text-[#78c7ff] hover:cursor-pointer hover:text-[#006eff] transtion duration-300 ease-in-out"
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
