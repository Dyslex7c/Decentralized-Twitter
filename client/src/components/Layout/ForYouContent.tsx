import PostBox from "./PostBox";
import { useRetrieveAllTweets } from "../../hooks/useRetrieveTweets";
import UserPosts from "./UserPosts";

const ForYouContent = () => {
  const { tweets } = useRetrieveAllTweets();
  console.log(tweets);

  return (
    <div className="">
      <div className="">
        <PostBox />
      </div>
      <UserPosts
        tweets={tweets}
        isProfile={false}
      />
    </div>
  );
};

export default ForYouContent;
