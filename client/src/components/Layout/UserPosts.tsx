import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchMedia from "../../hooks/useFetchMedia";
import useLikeStatus from "../../hooks/useLikeStatus";
import useCommentHandler from "../../hooks/useCommentHandler";
import { useTweetContract } from "../../hooks/useTweetContract";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { createInteractionIcons } from "../../utils/InteractionIcons";
import { RootState } from "../../store";
import { Tweet } from "../../types";
import { BigNumber } from "ethers";
import ReactLoading from "react-loading";
import CommentModal from "../Overlay/CommentModal";
import useRepostStatus from "../../hooks/useRepostStatus";

type UserPostsProps = {
  tweets: Tweet[];
  isProfile: boolean;
};

const UserPosts = ({ tweets, isProfile }: UserPostsProps) => {
  const [hoveredIcon, setHoveredIcon] = useState<{
    postId: string;
    label: string;
  } | null>(null);

  const [activatedTweet, setActivatedTweet] = useState<Tweet>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const currentUserID = localStorage.getItem("userID");
  const { userID } = useParams<{ userID: string }>();
  const [updatedTweets, setUpdatedTweets] = useState<Tweet[]>([]);
  const { contract } = usePostInteractions();
  const { contract: tweetContract } = useTweetContract();
  const { mediaElements } = useFetchMedia(tweets);
  const [commentModal, setCommentModal] = useState(false);

  const toggleCommentModal = () => {
    setCommentModal(!commentModal);
  };

  useEffect(() => {
    const mappedTweets = tweets.map((tweet) => {
      const timestamp = BigNumber.from(tweet.timestamp._hex).toNumber();
      const date = new Date(timestamp * 1000);
      return {
        ...tweet,
        date: date.getDate(),
        month: date.toLocaleDateString("default", { month: "short" }),
      };
    });
    setUpdatedTweets(mappedTweets);
  }, [tweets]);

  const { likeCounts, likedTweets, likeTweet, unlikeTweet } = useLikeStatus(
    tweets,
    contract
  );

  const { totalComments, hasUserCommented } = useCommentHandler(
    tweets,
    contract
  );

  const handleComment = (tweet: Tweet) => {
    setActivatedTweet(tweet);
    setCommentModal(true);
    console.log(`Comment on tweet: ${tweet.id}`);
  };

  const handleRepost = (tweet: Tweet) => {
    console.log("reposting");
    repostTweet(tweet, user, currentUserID);
  };

  const { repostTweet, repostCounts, repostedTweets } = useRepostStatus(
    tweets,
    tweetContract
  );

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

  return (
    <>
      {commentModal && activatedTweet && (
        <CommentModal
          isVisible={commentModal}
          toggleCommentModal={toggleCommentModal}
          tweet={activatedTweet}
          tweets={[activatedTweet]}
        />
      )}

      {updatedTweets.map((tweet) => {
        if (isProfile && userID && userID !== tweet.authorID) {
          return null;
        }

        return (
          <div key={tweet.id} className="border-b border-gray-700">
            <div className="m-4 max-w-4xl">
              {tweet.isRepost && (
                <div className="flex flex-col items-start mb-2 text-gray-500">
                  <div className="flex flex-row">
                    <img
                      src={tweet.reposterAvatar}
                      alt="reposter-avatar"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-white"
                    />
                    <div className="flex flex-col">
                      <div className="flex flex-col sm:flex-row ml-2">
                        <p
                          className="font-semibold text-white mr-2 cursor-pointer"
                          style={{ fontFamily: "Roboto" }}
                          onClick={() => navigate(`/profile/${tweet.authorID}`)}
                        >
                          {tweet.reposter}
                        </p>
                        <p
                          className="text-sm mr-2 text-gray-500 cursor-pointer"
                          style={{ fontFamily: "Roboto" }}
                          onClick={() => navigate(`/profile/${tweet.authorID}`)}
                        >
                          @{tweet.reposterID}
                        </p>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "Roboto" }}
                        >
                          {tweet.date} {tweet.month}
                        </p>
                      </div>
                      <p
                        className="cursor-pointer ml-2"
                        onClick={() =>
                          navigate(`/${tweet.reposterID}/status/${tweet.id}`, {
                            state: { tweet },
                          })
                        }
                      >
                        reposted
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex flex-row ${
                  tweet.isRepost
                    ? "border border-gray-700 p-4 rounded-xl ml-14"
                    : ""
                }`}
              >
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

                  {mediaElements[tweet.id] !== undefined ? (
                    mediaElements[tweet.id]
                  ) : (
                    <ReactLoading
                      type="spin"
                      color="blue"
                      height={50}
                      width={50}
                    />
                  )}

                  <div className="mt-2 flex flex-row max-w-60 justify-between">
                    {interactionIcons.map(
                      (
                        {
                          icon,
                          iconActivated,
                          label,
                          color,
                          hoverColor,
                          action,
                        },
                        index
                      ) => {
                        let isActivated = false;
                        let displayCount = "";

                        if (label === "Like") {
                          isActivated = likedTweets[tweet.id];
                          displayCount = likeCounts[tweet.id]?.toString() || "";
                        } else if (label === "Comment") {
                          isActivated = hasUserCommented[tweet.id];
                          displayCount =
                            totalComments[tweet.id]?.toString() || "";
                        } else if (label === "Repost") {
                          isActivated = repostedTweets[tweet.id];
                          displayCount =
                            repostCounts[tweet.id]?.toString() || "";
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
                              {displayCount && displayCount !== "0" && (
                                <span className="text-xs">{displayCount}</span>
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
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default UserPosts;
