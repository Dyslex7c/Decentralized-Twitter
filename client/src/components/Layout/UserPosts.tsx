import { useState } from "react";
import { MdOutlineModeComment } from "react-icons/md";
import { BiBookmark, BiLike, BiRepost } from "react-icons/bi";
import { SiGoogleanalytics } from "react-icons/si";

type Tweet = {
  id: string;
  author: string;
  content: string;
  mediaCID: string;
};

type UserPostsProps = {
  tweets: Tweet[];
  userAvatar: string | undefined;
  userName: string | undefined;
  userID: string | null;
};

const interactionIcons = [
  { icon: <MdOutlineModeComment />, label: "Comment" },
  { icon: <BiRepost />, label: "Repost" },
  { icon: <BiLike />, label: "Like" },
  { icon: <SiGoogleanalytics />, label: "Analytics" },
  { icon: <BiBookmark />, label: "Bookmark" },
];

const UserPosts = ({
  tweets,
  userAvatar,
  userName,
  userID,
}: UserPostsProps) => {
  const [hoveredIcon, setHoveredIcon] = useState<{
    postId: string;
    label: string;
  } | null>(null);

  return (
    <>
      {tweets.map((tweet) => (
        <div key={tweet.id} className="border-b border-gray-700">
          <div className="flex flex-row m-4 max-w-4xl">
            <img
              src={userAvatar}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover bg-white"
            />
            <div className="flex flex-col ml-2">
              <div className="flex flex-row">
                <p
                  className="font-semibold mr-2"
                  style={{ fontFamily: "Roboto" }}
                >
                  {userName}
                </p>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "Roboto" }}
                >
                  @{userID}
                </p>
              </div>
              <p>{tweet.content}</p>
              {tweet.mediaCID && (
                <div className="my-3">
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${tweet.mediaCID}`}
                    alt="postimg"
                    width="60%"
                    className="rounded-xl"
                  />
                </div>
              )}
              <div className="mt-2 flex flex-row justify-between">
                {interactionIcons.map(({ icon, label }, index) => (
                  <div key={index} className="relative">
                    <button
                      onMouseEnter={() =>
                        setHoveredIcon({ postId: tweet.id, label })
                      }
                      onMouseLeave={() => setHoveredIcon(null)}
                      className="text-gray-400 hover:text-white transition text-xl"
                    >
                      {icon}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserPosts;
