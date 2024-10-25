import React from "react";
import PostBox from "./PostBox";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useRetrieveTweetsByUser } from "../../hooks/useRetrieveTweets";

const ForYouContent = () => {
  const user = useSelector((state: RootState) => state.user);
  const userAddress = user?.address;
  const { tweets } = useRetrieveTweetsByUser(userAddress || "");
  console.log(tweets);

  return (
    <div>
      <PostBox />
    </div>
  );
};

export default ForYouContent;
