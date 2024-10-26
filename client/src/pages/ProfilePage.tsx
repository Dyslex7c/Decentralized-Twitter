import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  useRetrieveAllTweets,
  useRetrieveTweetsByUser,
} from "../hooks/useRetrieveTweets";
import UserProfile from "../components/Layout/UserProfile";
import UserPosts from "../components/Layout/UserPosts";
import { RootState } from "../store";
import { BigNumber } from "ethers";

interface User {
  id: string;
  name: string;
  address: string;
  avatar: string;
}

type Tweet = {
  date: number;
  month: string;
  id: string;
  name: string;
  author: string;
  authorID: string;
  content: string;
  mediaCID: string;
  timestamp: BigNumber;
};

const ProfilePage = () => {
  const [activeComponent, setActiveComponent] = useState<"posts" | "replies">(
    "posts"
  );
  const [userAddress, setUserAddress] = useState<string | undefined | null>(
    null
  );
  const [otherUser, setOtherUser] = useState<User | null>(null);

  const location = useLocation();
  const { userID } = useParams<{ userID: string }>();

  const currentUser = useSelector((state: RootState) => state.user);
  const isCurrentUser = useMemo(
    () => location.pathname === "/profile",
    [location]
  );

  const { tweets: allTweets }: { tweets: Tweet[] } = useRetrieveAllTweets();

  const selectedUser = useMemo(() => {
    if (isCurrentUser) return currentUser;

    const userTweet = allTweets.find(
      (tweet: Tweet) => tweet.authorID === userID
    );
    if (!userTweet) return null;

    return {
      id: userTweet.authorID,
      name: userTweet.name,
      address: userTweet.author,
      avatar: "https://cdn-icons-png.flaticon.com/128/10/10960.png",
    };
  }, [isCurrentUser, currentUser, allTweets, userID]);

  useEffect(() => {
    if (isCurrentUser) {
      setUserAddress(currentUser?.address || null);
    } else if (selectedUser) {
      setUserAddress(selectedUser.address);
      setOtherUser(selectedUser as User);
    }
  }, [isCurrentUser, currentUser, selectedUser]);

  const requestEthereumAccount = useCallback(() => {
    if (!userAddress && window.ethereum?.request) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(([address]: string[]) => setUserAddress(address))
        .catch((error) => console.error("Ethereum request error:", error));
    }
  }, [userAddress]);

  useEffect(() => {
    requestEthereumAccount();
  }, [requestEthereumAccount]);

  const { tweets } = useRetrieveTweetsByUser(userAddress || "");

  return (
    <>
      <UserProfile
        tweetCount={tweets.length}
        user={isCurrentUser ? currentUser : otherUser}
      />

      <div className="flex justify-evenly text-gray-400 sticky top-0 bg-black z-10">
        {["posts", "replies"].map((component) => (
          <button
            key={component}
            onClick={() => setActiveComponent(component as "posts" | "replies")}
            className="w-1/2"
          >
            <div
              className={`p-4 text-center transition duration-300 ${
                activeComponent === component
                  ? "text-white font-bold border-b-2 border-blue-600"
                  : "border-b border-gray-700 hover:border-white"
              }`}
            >
              {component.charAt(0).toUpperCase() + component.slice(1)}
            </div>
          </button>
        ))}
      </div>

      {activeComponent === "posts" && (
        <UserPosts
          tweets={tweets}
          userAvatar={isCurrentUser ? currentUser?.avatar : otherUser?.avatar}
          userName={isCurrentUser ? currentUser?.name : otherUser?.name}
          userID={localStorage.getItem("userID") || ""}
        />
      )}
    </>
  );
};

export default ProfilePage;
