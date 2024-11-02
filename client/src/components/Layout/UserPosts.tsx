import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineModeComment } from "react-icons/md";
import { BiBookmark, BiLike, BiRepost, BiSolidLike } from "react-icons/bi";
import { SiGoogleanalytics } from "react-icons/si";
import { BigNumber } from "ethers";
import ReactLoading from "react-loading";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import useFetchMedia from "../../hooks/useFetchMedia";
import useLikeStatus from "../../hooks/useLikeStatus";

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

const interactionIcons = [
  { icon: <MdOutlineModeComment />, label: "Comment" },
  { icon: <BiRepost />, label: "Repost" },
  { icon: <BiLike />, iconActivated: <BiSolidLike />, label: "Like" },
  { icon: <SiGoogleanalytics />, label: "Analytics" },
  { icon: <BiBookmark />, label: "Bookmark" },
];

const UserPosts = ({ tweets, isProfile }: UserPostsProps) => {
  const [hoveredIcon, setHoveredIcon] = useState<{
    postId: string;
    label: string;
  } | null>(null);
  const navigate = useNavigate();
  const { userID } = useParams<{ userID: string }>();
  const [updatedTweets, setUpdatedTweets] = useState<Tweet[]>([]);
  const { contract } = usePostInteractions();
  const { mediaElements } = useFetchMedia(tweets);

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

  return (
    <>
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
                <p className="cursor-pointer" onClick={() => navigate(`/${tweet.authorID}/status/${tweet.id}`, { state: { tweet } })}>{tweet.content}</p>

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
                    ({ icon, iconActivated, label }, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() =>
                            likedTweets[tweet.id]
                              ? unlikeTweet(tweet.id, tweet.author)
                              : likeTweet(tweet.id, tweet.author)
                          }
                          onMouseEnter={() =>
                            setHoveredIcon({ postId: tweet.id, label })
                          }
                          onMouseLeave={() => setHoveredIcon(null)}
                          className={`${
                            likedTweets[tweet.id] && label === "Like"
                              ? "text-green-400"
                              : "text-gray-400"
                          } hover:text-green-400 hover:bg-gray-800 transition text-xl p-2 rounded-full flex items-center space-x-1`}
                        >
                          {likedTweets[tweet.id] && label === "Like"
                            ? iconActivated
                            : icon}
                          {label === "Like" && (
                            <span className="text-xs">
                              {likeCounts[tweet.id] || ""}
                            </span>
                          )}
                          <div
                            className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 transition-opacity duration-200 ease-in-out ${
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
                    )
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
