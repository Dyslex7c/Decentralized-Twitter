import { ChangeEvent, useState } from "react";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { BigNumber } from "ethers";
import ReactLoading from "react-loading";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Tweet = {
  date: number;
  month: string;
  id: string;
  name: string;
  avatar: string;
  author: string;
  authorID: string;
  content: string;
  mediaCID: string;
  timestamp: BigNumber;
};

interface Comment {
  comment: string;
}

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
  const navigate = useNavigate();

  const userID = localStorage.getItem("userID");

  const user = useSelector((state: RootState) => state.user);
  const { contract } = usePostInteractions();

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
        ""
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
      <ToastContainer />
      <div
        className={`relative bg-black shadow-2xl shadow-blue-500 p-4 md:p-7 max-w-lg min-w-[300px] leading-relaxed transition-all duration-300 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div
          className="p-3 absolute top-0 right-0 cursor-pointer hover:bg-[#c70606] transition duration-300 ease-in-out"
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
        <div className="flex flex-row m-4 max-w-4xl">
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
            <p className="mt-2 text-gray-500">Replying to <span className="text-blue-600">@{tweet.authorID}</span></p>
          </div>
        </div>
        <div className="flex flex-row m-4">
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
        <div className="flex justify-center">
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
