import { IoIosReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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

  const userID = localStorage.getItem("userID");
  if (userID === user?.id) navigate("/profile");
  console.log(userID);

  return (
    <>
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
        <div className="absolute top-32 left-5 flex flex-col items-center">
          <img
            src={user?.avatar}
            alt="profile"
            height={120}
            width={120}
            className="bg-white rounded-full"
          />
          <p className="mt-4 text-2xl font-bold">{user?.name}</p>
          <p className="text-sm text-gray-500">@{user?.id || userID}</p>
        </div>
      </div>
      <div className="h-48"></div>
    </>
  );
};

export default UserProfile;
