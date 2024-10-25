import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosReturnLeft } from "react-icons/io";
import { useRetrieveTweetsByUser } from "../hooks/useRetrieveTweets";
import { RootState } from "../store";
import UserPosts from "../components/Layout/UserPosts";

const ProfilePage = () => {
  const [activeComponent, setActiveComponent] = useState("posts");
  
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);
  const userAddress = user?.address;
  const userID = localStorage.getItem("userID");

  const { tweets } = useRetrieveTweetsByUser(userAddress || "");

  return (
    <>
      <div className="fixed w-full bg-black/[.5] z-40 flex flex-row items-center p-4">
        <IoIosReturnLeft onClick={() => navigate("/home")} className="text-2xl mr-4 cursor-pointer" />
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "Roboto" }}>
            {user?.name}
          </p>
          <p className="text-sm text-gray-500">{tweets.length} post(s)</p>
        </div>
      </div>

      <div className="relative mt-20">
        <div className="w-full h-48 bg-gray-800"></div>
        <div className="absolute top-32 left-5 flex flex-col items-center">
          <img
            src={user?.avatar}
            alt="profile"
            height={120}
            width={120}
            className="bg-white rounded-full"
          />
          <p
            className="mt-4 text-2xl font-bold"
            style={{ fontFamily: "Roboto" }}
          >
            {user?.name}
          </p>
          <p className="text-sm text-gray-500" style={{ fontFamily: "Roboto" }}>
            @{userID}
          </p>
        </div>
      </div>

      <div className="h-48"></div>

      <div className="flex justify-evenly text-gray-400 sticky top-0 bg-black z-10">
        <button onClick={() => setActiveComponent("posts")} className="w-1/2">
          <div
            className={`p-4 text-center hover:border-white transition duration-300 ${
              activeComponent === "posts"
                ? "text-white font-bold border-b-2 border-blue-600"
                : "border-b border-gray-700"
            }`}
            style={{ fontFamily: "Prompt" }}
          >
            Posts
          </div>
        </button>
        <button onClick={() => setActiveComponent("replies")} className="w-1/2">
          <div
            className={`p-4 text-center hover:border-white transition duration-300 ${
              activeComponent === "replies"
                ? "text-white font-bold border-b-2 border-blue-600"
                : "border-b border-gray-700"
            }`}
            style={{ fontFamily: "Prompt" }}
          >
            Replies
          </div>
        </button>
      </div>

      {activeComponent === "posts" && (
        <UserPosts
          tweets={tweets}
          userAvatar={user?.avatar}
          userName={user?.name}
          userID={userID}
        />
      )}
    </>
  );
};

export default ProfilePage;
