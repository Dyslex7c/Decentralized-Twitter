import React from "react";
import { Tweet } from "../../types";

type TweetInteractionIconsProps = {
  tweet: Tweet;
  interactionIcons: any[];
  hoveredIcon: { postId: string; label: string } | null;
  setHoveredIcon: React.Dispatch<
    React.SetStateAction<{ postId: string; label: string } | null>
  >;
  likedTweets: Record<string, boolean>;
  likeCounts: Record<string, number>;
  hasUserCommented: Record<string, boolean>;
  totalComments: Record<string, number>;
  repostedTweets: Record<string, boolean>;
  repostCounts: Record<string, number>;
  bookmarkedTweets: Record<string, boolean>;
  bookmarkCounts: Record<string, number>;
};

const TweetInteractionIcons: React.FC<TweetInteractionIconsProps> = ({
  tweet,
  interactionIcons,
  hoveredIcon,
  setHoveredIcon,
  likedTweets,
  likeCounts,
  hasUserCommented,
  totalComments,
  repostedTweets,
  repostCounts,
  bookmarkedTweets,
  bookmarkCounts,
}) => {
  return (
    <div className="mt-2 flex flex-row w-[25rem] justify-between">
      {interactionIcons.map(
        ({ icon, iconActivated, label, color, hoverColor, action }, index) => {
          let isActivated = false;
          let displayCount = "";

          if (label === "Like") {
            isActivated = likedTweets[tweet.id];
            displayCount = likeCounts[tweet.id]?.toString() || "";
          } else if (label === "Comment") {
            isActivated = hasUserCommented[tweet.id];
            displayCount = totalComments[tweet.id]?.toString() || "";
          } else if (label === "Repost") {
            isActivated = repostedTweets[tweet.id];
            displayCount = repostCounts[tweet.id]?.toString() || "";
          } else if (label === "Bookmark") {
            isActivated = bookmarkedTweets[tweet.id];
            displayCount = bookmarkCounts[tweet.id]?.toString() || "";
          }

          return (
            <div key={index} className="relative">
              <button
                onClick={() => action(tweet)}
                onMouseEnter={() => setHoveredIcon({ postId: tweet.id, label })}
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
  );
};

export default TweetInteractionIcons;
