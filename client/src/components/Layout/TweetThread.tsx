import { useEffect, useMemo, useState } from "react";
import ReactLoading from "react-loading";
import { IoIosReturnLeft } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useFetchMedia from "../../hooks/useFetchMedia";
import { BigNumber } from "ethers";
import useLikeStatus from "../../hooks/useLikeStatus";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { useRetrieveComments } from "../../hooks/useRetrieveComments";
import UserPosts from "./UserPosts";
import { Tweet } from "../../types";
import { createInteractionIcons } from "../../utils/InteractionIcons";
import CommentModal from "../Overlay/CommentModal";
import useCommentHandler from "../../hooks/useCommentHandler";

const TweetThread = () => {
  const [hoveredIcon, setHoveredIcon] = useState<{
    postId: string;
    label: string;
  } | null>(null);
  const [activatedTweet, setActivatedTweet] = useState<Tweet>();
  const navigate = useNavigate();
  const location = useLocation();
  const tweet = location.state?.tweet as Tweet | undefined;
  const [formattedDateTime, setFormattedDateTime] = useState<string | null>(
    null
  );
  const [commentModal, setCommentModal] = useState(false);

  const toggleCommentModal = () => {
    setCommentModal(!commentModal);
  };

  const { contract } = usePostInteractions();

  const author = tweet?.author || "";
  const tweetId = tweet?.id || "";

  const { comments } = useRetrieveComments(author, tweetId);

  const mediaAttachedTweets = useMemo(
    () => (tweet?.mediaCID ? [tweet] : []),
    [tweet]
  );
  const { mediaElements } = useFetchMedia(mediaAttachedTweets);

  useEffect(() => {
    if (!tweet?.timestamp) return;

    const timestamp = BigNumber.from(tweet.timestamp).toNumber();
    const date = new Date(timestamp * 1000);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    setFormattedDateTime(`${formattedTime} · ${formattedDate}`);
  }, [tweet?.timestamp]);

  const { likeCounts, likedTweets, likeTweet, unlikeTweet } = useLikeStatus(
    tweet ? [tweet] : [],
    contract
  );

  const { totalComments, hasUserCommented } = useCommentHandler(
    tweet ? [tweet] : [],
    contract
  );

  const handleComment = (tweet: Tweet) => {
    setActivatedTweet(tweet);
    setCommentModal(true);
    console.log(`Comment on tweet: ${tweet.id}`);
  };

  const handleRepost = (tweet: Tweet) => {
    console.log(`Repost tweet: ${tweet.id}`);
  };

  const handleLike = (tweet: Tweet) => {
    likedTweets[tweet.id]
      ? unlikeTweet(tweet.id, tweet.author)
      : likeTweet(tweet.id, tweet.author);
  };

  const handleAnalytics = (tweet: Tweet) => {
    console.log(`Show analytics for tweet: ${tweet.id}`);
  };

  const handleBookmark = (tweet: Tweet) => {
    console.log(`Bookmark tweet: ${tweet.id}`);
  };

  const interactionIcons = createInteractionIcons(
    handleComment,
    handleRepost,
    handleLike,
    handleAnalytics,
    handleBookmark
  );

  if (!tweet) {
    return <ReactLoading />;
  }

  return (
    <>
      {commentModal && (
        <CommentModal
          isVisible={commentModal}
          toggleCommentModal={toggleCommentModal}
          tweet={activatedTweet}
        />
      )}
      <ToastContainer />
      <div className="fixed w-full bg-black/[.5] z-40 flex flex-row items-center p-4">
        <IoIosReturnLeft
          onClick={() => navigate("/home")}
          className="text-2xl mr-4 cursor-pointer"
        />
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "Roboto" }}>
            Post
          </p>
        </div>
      </div>
      <div className="p-4 border-b border-gray-700">
        <div
          className="mt-16 flex items-center"
          style={{ fontFamily: "Roboto" }}
        >
          <img
            src={tweet.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-2 bg-white"
          />
          <div className="hidden lg:block flex-col text-md">
            <p className="font-bold">{tweet.name}</p>
            <p className="text-gray-500">@{tweet.authorID}</p>
          </div>
        </div>
        <div className="mt-2 text-xl">
          <p>{tweet.content}</p>
        </div>
        {tweet.mediaCID ? (
          mediaElements[tweet.id] !== undefined ? (
            mediaElements[tweet.id]
          ) : (
            <ReactLoading type="spin" color="blue" height={50} width={50} />
          )
        ) : null}
        <div className="mt-4 text-gray-500">
          <p>{formattedDateTime}</p>
        </div>
        <div className="mt-2 flex flex-row max-w-96 justify-between">
          {interactionIcons.map(
            (
              { icon, iconActivated, label, color, hoverColor, action },
              index
            ) => {
              let isActivated = false;

              if (label === "Like" && likedTweets[tweet.id]) {
                isActivated = true;
              } else if (label === "Comment" && hasUserCommented[tweet.id]) {
                isActivated = true;
              }

              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => action(tweet)}
                    onMouseEnter={() =>
                      setHoveredIcon({ postId: tweet.id, label })
                    }
                    onMouseLeave={() => setHoveredIcon(null)}
                    className={`${
                      isActivated ? color : "text-gray-400"
                    } ${hoverColor} hover:bg-gray-800 transition text-xl p-2 rounded-full flex items-center space-x-1`}
                  >
                    {isActivated ? iconActivated : icon}

                    {label === "Like" && (
                      <span className="text-xs">
                        {likeCounts[tweet.id] || ""}
                      </span>
                    )}
                    {label === "Comment" && (
                      <span className="text-xs">
                        {totalComments[tweet.id] || ""}
                      </span>
                    )}

                    <div
                      className={`absolute top-10 left-1/3 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 ease-in-out ${
                        hoveredIcon?.postId === tweet.id &&
                        hoveredIcon.label === label
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {label}
                    </div>
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
      <UserPosts tweets={comments} isProfile={false} />
    </>
  );
};

export default TweetThread;
