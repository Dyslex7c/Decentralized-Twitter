import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useRetrieveFollowerList,
  useRetrieveFollowingList,
} from "../../hooks/useRetrieveFollowers";
import { useFollowSystem } from "../../hooks/useFollowSystem";
import { IoIosReturnLeft } from "react-icons/io";
import { RootState } from "../../store";
import { toast, ToastContainer } from "react-toastify";

interface User {
  id?: string;
  address?: string | undefined;
  avatar: string;
  name: string;
}

interface UserProfileProps {
  tweetCount: number;
  user: User | null;
}

const UserProfile = ({ tweetCount, user }: UserProfileProps) => {
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user);

  const currentUserID = localStorage.getItem("userID");
  if (currentUserID === user?.id) navigate("/profile");

  const { userID } = useParams<{ userID: string }>();

  const { contract } = useFollowSystem();
  const { followerList } = useRetrieveFollowerList(user?.address || "");
  const { followingList } = useRetrieveFollowingList(user?.address || "");

  useEffect(() => {
    const isUserFollowing = async () => {
      if (contract) {
        try {
          const isFollowing = await contract.isFollowing(
            currentUser?.address,
            user?.address
          );
          setIsFollowing(isFollowing);
        } catch (err) {
          console.error("Error: cannot fetch following details", err);
        }
      }
    };
    isUserFollowing();
  }, [contract, user?.address, currentUser?.address]);

  const followUser = async () => {
    if (contract) {
      try {
        const transaction = await contract.follow(user?.address);
        await transaction.wait();
        toast.success(`Started following @${user?.id}!`);
        setIsFollowing(true);
      } catch (error) {
        console.error("Error while following:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  const unfollowUser = async () => {
    if (contract) {
      try {
        const transaction = await contract.unfollow(user?.address);
        await transaction.wait();
        toast.error(`Unfollowed ${user?.id}`);
        setIsFollowing(false);
      } catch (error) {
        console.error("Error while unfollowing:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  const handleFollowClick = () => {
    if (!isFollowing) followUser();
    else unfollowUser();
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed w-full bg-black/[.5] z-40 flex flex-row items-center p-4">
        <IoIosReturnLeft
          onClick={() => navigate("/home")}
          className="text-2xl mr-4 cursor-pointer"
        />
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "Roboto" }}>
            {user?.name}
          </p>
          <p className="text-sm text-gray-500">{tweetCount} post(s)</p>
        </div>
      </div>

      <div className="relative mt-20">
        <div className="w-full h-48 bg-gray-800"></div>
        <div className="absolute top-32 left-5 right-5 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <img
              src={user?.avatar}
              alt="profile"
              height={120}
              width={120}
              className="bg-white rounded-full"
            />
            <p className="mt-4 text-2xl font-bold">{user?.name}</p>
            <p className="text-sm text-gray-500">
              @{user?.id || currentUserID}
            </p>
          </div>
          {userID && (
            <button
              onClick={handleFollowClick}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={`bg-white ${
                isFollowing
                  ? "hover:bg-red-600 hover:text-white"
                  : "hover:bg-gray-800 hover:text-white"
              } transition 
              duration-300 ease-in-out text-black p-2 px-6 rounded-full flex 
              items-center justify-center gap-2`}
              style={{ fontFamily: "Roboto", fontWeight: 600 }}
            >
              {isFollowing ? (hovering ? "Unfollow" : "Following") : "Follow"}
            </button>
          )}
        </div>
        <div className="absolute top-80 left-5 flex justify-between w-40">
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">
              {followingList.length}
            </span>{" "}
            Following
          </p>
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">
              {followerList.length}
            </span>{" "}
            Follower
          </p>
        </div>
      </div>
      <div className="h-48"></div>
    </>
  );
};

export default UserProfile;
