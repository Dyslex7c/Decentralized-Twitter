import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookmarkStatus from "../../hooks/useBookmarkStatus";
import { useRetrieveAllTweets } from "../../hooks/useRetrieveTweets";
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { Tweet } from "../../types";
import { IoIosReturnLeft } from "react-icons/io";
import UserPosts from "./UserPosts";

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Tweet[]>([]);

  const { tweets } = useRetrieveAllTweets();
  const { contract } = usePostInteractions();
  const { bookmarkedTweets } = useBookmarkStatus(tweets, contract);

  useEffect(() => {
    const updatedTweets = tweets.filter(
      (tweet: Tweet) => bookmarkedTweets[tweet.id]
    );
    setBookmarks(updatedTweets);
  }, [bookmarkedTweets, tweets]);

  console.log(bookmarks);

  return (
    <>
      <div className="fixed w-full bg-black/[.5] z-40 flex flex-row items-center p-4">
        <IoIosReturnLeft
          onClick={() => navigate("/home")}
          className="text-2xl mr-4 cursor-pointer"
        />
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "Roboto" }}>
            Bookmarks
          </p>
        </div>
      </div>
      <div className="mt-16"></div>
      <UserPosts tweets={bookmarks} isProfile={false} />
    </>
  );
};

export default Bookmarks;
