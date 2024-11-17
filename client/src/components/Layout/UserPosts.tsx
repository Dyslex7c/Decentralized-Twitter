import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetchMedia from "../../hooks/useFetchMedia";
import useLikeStatus from "../../hooks/useLikeStatus";
import useRepostStatus from "../../hooks/useRepostStatus";
import useCommentHandler from "../../hooks/useCommentHandler";
import useBookmarkStatus from "../../hooks/useBookmarkStatus";
import { useTweetContract } from "../../hooks/useTweetContract";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { createInteractionIcons } from "../../utils/InteractionIcons";
import { RootState } from "../../store";
import { Tweet } from "../../types";
import { BigNumber } from "ethers";
import ReactLoading from "react-loading";
import CommentModal from "../Overlay/CommentModal";
import TweetInteractionIcons from "./TweetInteractionIcons";
import { mergeSortTweets } from "../../utils/sortTweets";

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

  console.log(tweets);

  const { likeCounts, likedTweets, likeTweet, unlikeTweet } = useLikeStatus(
    tweets,
    contract
  );

  const { totalComments, hasUserCommented } = useCommentHandler(
    tweets,
    contract
  );

  const { repostTweet, repostCounts, repostedTweets } = useRepostStatus(
    tweets,
    tweetContract
  );

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

    const sortedTweets = mergeSortTweets(
      mappedTweets,
      likeCounts,
      totalComments,
      repostCounts
    );

    setUpdatedTweets(sortedTweets);
  }, [tweets, likeCounts, totalComments, repostCounts]);

  const handleComment = (tweet: Tweet) => {
    setActivatedTweet(tweet);
    setCommentModal(true);
    console.log(`Comment on tweet: ${tweet.id}`);
  };

  const handleRepost = (tweet: Tweet) => {
    console.log("reposting");
    repostTweet(tweet, user, currentUserID);
  };

  const { bookmarkCounts, bookmarkedTweets, bookmarkTweet, unbookmarkTweet } =
    useBookmarkStatus(tweets, contract);

  const handleLike = (tweet: Tweet) => {
    likedTweets[tweet.id]
      ? unlikeTweet(tweet.id, tweet.author)
      : likeTweet(tweet.id, tweet.author);
  };

  const handleAnalytics = (tweet: Tweet) => {
    console.log(`Show analytics for tweet: ${tweet.id}`);
  };

  const handleBookmark = (tweet: Tweet) => {
    bookmarkedTweets[tweet.id]
      ? unbookmarkTweet(tweet.id, tweet.author)
      : bookmarkTweet(tweet.id, tweet.author);
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
            <div className="p-4 max-w-4xl">
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
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="flex flex-row">
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
                  <TweetInteractionIcons
                    tweet={tweet}
                    interactionIcons={interactionIcons}
                    hoveredIcon={hoveredIcon}
                    setHoveredIcon={setHoveredIcon}
                    likedTweets={likedTweets}
                    likeCounts={likeCounts}
                    hasUserCommented={hasUserCommented}
                    totalComments={totalComments}
                    repostedTweets={repostedTweets}
                    repostCounts={repostCounts}
                    bookmarkedTweets={bookmarkedTweets}
                    bookmarkCounts={bookmarkCounts}
                  />
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
