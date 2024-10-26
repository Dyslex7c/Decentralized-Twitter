import PostBox from "./PostBox";
import { useRetrieveAllTweets } from "../../hooks/useRetrieveTweets";
import UserPosts from "./UserPosts";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const ForYouContent = () => {
  const user = useSelector((state: RootState) => state.user);
  const userID = localStorage.getItem("userID");
  const { tweets } = useRetrieveAllTweets();
  console.log(tweets);

  return (
    <div className="">
      <div className="">
        <PostBox />
      </div>
      <UserPosts
        tweets={tweets}
        userAvatar={user?.avatar}
        userID={userID}
        userName={user?.name}
      />
    </div>
  );
};

export default ForYouContent;
