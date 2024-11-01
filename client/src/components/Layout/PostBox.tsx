import { useState } from "react";
import { useSelector } from "react-redux";
import { useTweetContract } from "../../hooks/useTweetContract";
import axios from "axios";
import {
  MdOutlineGif,
  MdOutlinePermMedia,
  MdOutlineSchedule,
  MdPoll,
} from "react-icons/md";
import { FaUserSecret } from "react-icons/fa";
import { RootState } from "../../store";
import { toast, ToastContainer } from "react-toastify";

const icons = [
  { key: "media", icon: <MdOutlinePermMedia />, tooltip: "Attach Media" },
  { key: "gif", icon: <MdOutlineGif />, tooltip: "Attach GIF" },
  { key: "poll", icon: <MdPoll />, tooltip: "Create Poll" },
  { key: "anonymous", icon: <FaUserSecret />, tooltip: "Post Anonymously" },
  { key: "schedule", icon: <MdOutlineSchedule />, tooltip: "Schedule Post" },
];

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_API_SECRET;

const PostBox = () => {
  const [text, setText] = useState("");
  const [postType, setPostType] = useState("Mutable");
  const [previewMediaURL, setPreviewMediaURL] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const [mediaCID, setMediaCID] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const userID = localStorage.getItem("userID");
  const { contract } = useTweetContract();

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "40px";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(event.target.value);
  };

  const handleIconClick = async (key: string) => {
    switch (key) {
      case "media":
        attachMedia();
        break;
      case "gif":
        alert("GIF attachment not implemented yet.");
        break;
      case "poll":
        createPoll();
        break;
      case "anonymous":
        toggleAnonymousPost();
        break;
      case "schedule":
        alert("Scheduling feature coming soon!");
        break;
      default:
        console.warn("Invalid action!");
    }
  };

  const attachMedia = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxContentLength: Infinity,
            headers: {
              "Content-Type": `multipart/form-data`,
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_SECRET_API_KEY,
            },
          }
        );

        const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

        const isVideo = file.type.startsWith("video");
        setMediaType(isVideo ? "video" : "image");
        setPreviewMediaURL(url);
        setMediaCID(res.data.IpfsHash);
      } catch (err) {
        console.error(err);
        toast.error("Failed to upload media.");
      }
    };
    input.click();
  };

  const createPoll = () => {
    alert("Poll creation is not available in this version.");
  };

  const toggleAnonymousPost = () => {
    alert("Posting anonymously!");
  };

  const postTweet = async () => {
    if (contract) {
      try {
        const transaction = await contract.postTweet(
          user?.name,
          userID,
          user?.avatar,
          text,
          mediaCID || ""
        );
        await transaction.wait();
        toast.success("Tweet posted successfully!");
        setText("");
        setPreviewMediaURL(null);
        setMediaCID(null);
        setMediaType(null);
      } catch (error) {
        console.error("Error posting tweet:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  return (
    <div className="flex-col relative hidden sm:block sm:flex-row sm:items-center lg:px-6 lg:pb-6 border-b border-gray-700">
      <ToastContainer />
      <div className="absolute top-2 right-4 sm:static px-2 sm:mr-4 lg:px-0">
        <select
          value={postType}
          onChange={(event) => setPostType(event.target.value)}
          className="bg-black text-white border border-gray-700 p-1 rounded"
        >
          <option value="Mutable">Mutable</option>
          <option value="Immutable">Immutable</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-start border-b border-gray-700 p-3">
        <img
          src={user?.avatar}
          alt="user"
          width={40}
          height={40}
          className="rounded-full bg-white mb-2 sm:mb:0"
        />
        <textarea
          placeholder="What's your Proof of Activity?"
          className="bg-black text-xl ml-1 w-full h-20 md:h-12 resize-none placeholder-gray-500 p-2 overflow-hidden focus:outline-none sm:ml-2"
          style={{ paddingTop: "10px" }}
          value={text}
          onChange={handleInput}
        />
      </div>

      {previewMediaURL && (
        <div className="flex justify-center mt-4">
          {mediaType === "video" ? (
            <video src={previewMediaURL} controls className="w-full max-w-md" />
          ) : (
            <img src={previewMediaURL} alt="Preview" className="max-w-md" />
          )}
        </div>
      )}

      <div className="flex flex-row justify-between items-center sm:mt-4 ml-16 gap-2">
        <div className="flex flex-row gap-2">
          {icons.map((item) => (
            <span
              key={item.key}
              className="relative group text-2xl cursor-pointer"
              onClick={() => handleIconClick(item.key)}
            >
              {item.icon}
              <span className="absolute top-8 -left-7 w-max px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.tooltip}
              </span>
            </span>
          ))}
        </div>
        <button
          onClick={postTweet}
          className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition 
            duration-300 ease-in-out text-white p-3 w-full sm:w-auto px-8 lg:px-16 rounded-full flex 
            items-center justify-center gap-2 mb-4 lg:m-0"
          style={{ fontFamily: "Roboto", fontWeight: 600 }}
        >
          Post
        </button>
      </div>

      {postType === "Immutable" && (
        <p className="text-[#ff0000] text-sm mt-8">
          Warning: Posts flagged as immutable are permanent and cannot be
          modified or deleted once submitted. Refrain from posting stuff which
          you're gonna delete anyway, such as casual selfies and pictures from
          your honeymoon.
        </p>
      )}
    </div>
  );
};

export default PostBox;
