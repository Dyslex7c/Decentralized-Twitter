import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdModeComment, MdOutlineModeComment } from "react-icons/md";
import { BiBookmark, BiLike, BiRepost, BiSolidLike } from "react-icons/bi";
import { SiGoogleanalytics } from "react-icons/si";
import { BigNumber } from "ethers";
import ReactLoading from "react-loading";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import useFetchMedia from "../../hooks/useFetchMedia";
import useLikeStatus from "../../hooks/useLikeStatus";
import useCommentHandler from "../../hooks/useCommentHandler";
import CommentModal from "../Overlay/CommentModal";

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
  const { userID } = useParams<{ userID: string }>();
  const [updatedTweets, setUpdatedTweets] = useState<Tweet[]>([]);
  const { contract } = usePostInteractions();
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

  const { totalComments, hasUserCommented } = useCommentHandler(tweets, contract);

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

  const interactionIcons = [
    {
      icon: <MdOutlineModeComment />,
      iconActivated: <MdModeComment />,
      label: "Comment",
      color: "text-blue-400",
      hoverColor: "hover:text-blue-400",
      action: handleComment,
    },
    {
      icon: <BiRepost />,
      label: "Repost",
      color: "text-green-400",
      hoverColor: "hover:text-green-400",
      action: handleRepost,
    },
    {
      icon: <BiLike />,
      iconActivated: <BiSolidLike />,
      label: "Like",
      color: "text-rose-400",
      hoverColor: "hover:text-rose-400",
      action: handleLike,
    },
    {
      icon: <SiGoogleanalytics />,
      label: "Analytics",
      color: "text-blue-400",
      hoverColor: "hover:text-blue-400",
      action: handleAnalytics,
    },
    {
      icon: <BiBookmark />,
      label: "Bookmark",
      color: "text-blue-400",
      hoverColor: "hover:text-blue-400",
      action: handleBookmark,
    },
  ];

  return (
    <>
      {commentModal && (
        <CommentModal
          isVisible={commentModal}
          toggleCommentModal={toggleCommentModal}
          tweet={activatedTweet}
        />
      )}

      {updatedTweets.map((tweet) => {
        if (isProfile && userID && userID !== tweet.authorID) {
          return null;
        }

        return (
          <div key={tweet.id} className="border-b border-gray-700">
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
            </div>
          </div>
        );
      })}
    </>
  );
};

export default UserPosts;
