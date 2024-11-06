import { ChangeEvent, useState } from "react";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ReactLoading from "react-loading";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Tweet } from "../../types";
import axios from "axios";
import {
  MdOutlineGif,
  MdOutlinePermMedia,
  MdOutlineSchedule,
  MdPoll,
} from "react-icons/md";
import { FaUserSecret } from "react-icons/fa";

interface Comment {
  comment: string;
}

const icons = [
  { key: "media", icon: <MdOutlinePermMedia />, tooltip: "Attach Media" },
  { key: "gif", icon: <MdOutlineGif />, tooltip: "Attach GIF" },
  { key: "poll", icon: <MdPoll />, tooltip: "Create Poll" },
  { key: "anonymous", icon: <FaUserSecret />, tooltip: "Post Anonymously" },
  { key: "schedule", icon: <MdOutlineSchedule />, tooltip: "Schedule Post" },
];

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_API_SECRET;

const CommentModal = ({
  toggleCommentModal,
  isVisible,
  tweet,
}: {
  toggleCommentModal: () => void;
  isVisible: boolean;
  tweet: Tweet | undefined;
}) => {
  const [comment, setComment] = useState<Comment>({
    comment: "",
  });
  const [previewMediaURL, setPreviewMediaURL] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const [mediaCID, setMediaCID] = useState<string | null>(null);

  const navigate = useNavigate();

  const userID = localStorage.getItem("userID");

  const user = useSelector((state: RootState) => state.user);
  const { contract } = usePostInteractions();

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

  const handleFieldChange =
    (field: keyof Comment) => (event: ChangeEvent<HTMLTextAreaElement>) => {
      setComment((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };

  const handleSetComment = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (contract) {
      const transaction = await contract.addComment(
        tweet?.author,
        tweet?.id,
        user?.name,
        userID,
        user?.avatar,
        comment.comment,
        mediaCID || ""
      );
      await transaction.wait();
      toast.success("Comment added successfully!");
      toggleCommentModal();
    }
  };

  if (!tweet) {
    return <ReactLoading />;
  }

  return (
    <div
      className={`${
        isVisible ? "animate-fade-in" : "hidden"
      } fixed inset-0 z-50 top-28 left-1/3 justify-center items-center text-white`}
    >
      <div className="relative max-w-lg h-10 bg-black">
        <div
          className="absolute p-3 top-0 z-50 cursor-pointer hover:bg-[#c70606] transition duration-300 ease-in-out"
          onClick={toggleCommentModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </div>
      </div>
      <ToastContainer />
      <div
        className={`relative bg-black shadow-2xl shadow-blue-500 p-4 md:p-7 max-w-lg min-w-[300px] leading-relaxed transition-all duration-300 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          maxHeight: "54vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div className="flex flex-row mx-4 mb-4 max-w-4xl">
          <img
            src={tweet.avatar}
            alt="profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-white"
          />
          <div className="flex flex-col ml-2">
            <div className="flex flex-col sm:flex-row">
              <p
                className="font-semibold mr-2 cursor-pointer"
                style={{ fontFamily: "Roboto" }}
                onClick={() => navigate(`/profile/${tweet.authorID}`)}
              >
                {tweet.name}
              </p>
              <p
                className="text-sm mr-2 text-gray-500 cursor-pointer"
                style={{ fontFamily: "Roboto" }}
                onClick={() => navigate(`/profile/${tweet.authorID}`)}
              >
                @{tweet.authorID}
              </p>
              <p
                className="text-sm text-gray-500"
                style={{ fontFamily: "Roboto" }}
              >
                {tweet.date} {tweet.month}
              </p>
            </div>
            <p
              className="cursor-pointer"
              onClick={() =>
                navigate(`/${tweet.authorID}/status/${tweet.id}`, {
                  state: { tweet },
                })
              }
            >
              {tweet.content}
            </p>
            <p className="mt-2 text-gray-500">
              Replying to{" "}
              <span className="text-blue-600">@{tweet.authorID}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-row mx-4 mt-4">
          <img
            src={tweet.avatar}
            alt="profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-white"
          />
          <textarea
            className="bg-black p-2 text-xl resize-none placeholder:text-gray-500 focus:outline-none w-full"
            placeholder="Post your reply"
            onChange={handleFieldChange("comment")}
          />
        </div>
        <div className="flex flex-row pl-16 pb-4 gap-2">
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
        {previewMediaURL && (
          <div className="flex justify-center mt-4">
            {mediaType === "video" ? (
              <video
                src={previewMediaURL}
                controls
                className="w-full max-w-md"
              />
            ) : (
              <img src={previewMediaURL} alt="Preview" className="max-w-md" />
            )}
          </div>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSetComment}
            className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition duration-300 ease-in-out text-white p-3 px-16 rounded-full flex items-center justify-center gap-2"
          >
            <span
              className="text-sm"
              style={{ fontFamily: "Poppins", fontWeight: 500 }}
            >
              Reply
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
