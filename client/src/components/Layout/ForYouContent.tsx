import PostBox from "./PostBox";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useRetrieveAllTweets } from "../../hooks/useRetrieveTweets";
import UserPosts from "./UserPosts";

const ForYouContent = () => {
  const [loading, setLoading] = useState(true);
  const { tweets } = useRetrieveAllTweets();

  useEffect(() => {
    setLoading(!tweets);
  }, [tweets]);

  return (
    <div>
      <div>
        <PostBox />
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <ReactLoading type="spin" color="blue" height={50} width={50} />
        </div>
      ) : (
        <UserPosts tweets={tweets} isProfile={false} />
      )}
    </div>
  );
};

export default ForYouContent;
