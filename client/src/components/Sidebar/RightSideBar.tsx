import { useSelector } from "react-redux";
import { RootState } from "../../store";

const RightSideBar = () => {
  const user = useSelector((state: RootState) => state.user);
  const userID = localStorage.getItem("userID");

  if (!userID) return null;

  return (
    <div className="fixed w-full h-full">
      <div className="m-4 p-4 border text-xl border-gray-700 rounded-xl">
        <p className="mb-2 font-bold" style={{ fontFamily: "Poppins" }}>
          You might like
        </p>
        <div className="flex flex-row py-4" style={{ fontFamily: "Roboto" }}>
          <img
            src={user?.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5 bg-white"
          />
          <div className="hidden lg:block flex-col text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">@{userID}</p>
          </div>
        </div>
        <div className="flex flex-row py-4" style={{ fontFamily: "Roboto" }}>
          <img
            src={user?.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5 bg-white"
          />
          <div className="hidden lg:block flex-col text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">@{userID}</p>
          </div>
        </div>
        <div className="flex flex-row py-4" style={{ fontFamily: "Roboto" }}>
          <img
            src={user?.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5 bg-white"
          />
          <div className="hidden lg:block flex-col text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">@{userID}</p>
          </div>
        </div>
        <div className="flex flex-row py-4" style={{ fontFamily: "Roboto" }}>
          <img
            src={user?.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5 bg-white"
          />
          <div className="hidden lg:block flex-col text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">@{userID}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
