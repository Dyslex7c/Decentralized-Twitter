import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRetrieveAllTweets } from "../../hooks/useRetrieveTweets";
import { useRetrieveFollowingList } from "../../hooks/useRetrieveFollowers";
import { RootState } from "../../store";
import { Tweet } from "../../types";
import UserPosts from "./UserPosts";
import PostBox from "./PostBox";

const FollowingContent = () => {
  const user = useSelector((state: RootState) => state.user);

  const [followingListTweets, setFollowingListTweets] = useState<Tweet[]>([]);

  const { followingList }: { followingList: string[] } =
    useRetrieveFollowingList(user?.address || "");

  const { tweets }: { tweets: Tweet[] } = useRetrieveAllTweets();

  useEffect(() => {
    if (followingList.length > 0) {
      const tweetsByFollowing = tweets.filter((tweet) =>
        followingList.includes(tweet.author)
      );
      setFollowingListTweets(tweetsByFollowing);
    }
  }, [followingList, tweets]);

  return (
    <div>
      <div>
        <PostBox />
      </div>
      <div>
        <UserPosts tweets={followingListTweets} isProfile={false} />
      </div>
    </div>
  );
};

export default FollowingContent;
