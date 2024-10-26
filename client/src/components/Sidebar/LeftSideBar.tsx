import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import {
  IoIosChatboxes,
  IoIosHome,
  IoIosMore,
  IoIosPeople,
  IoIosPerson,
  IoIosSearch,
  IoIosNotifications,
} from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { v5 as uuidv5 } from "uuid";
import UsernameModal from "../UsernameModal";

const bannerItems = [
  { name: "Home", icon: <IoIosHome />, route: "/home" },
  { name: "Explore", icon: <IoIosSearch />, route: "/explore" },
  {
    name: "Notifications",
    icon: <IoIosNotifications />,
    route: "/notifications",
  },
  { name: "Messages", icon: <IoIosChatboxes />, route: "/messages" },
  { name: "Communities", icon: <IoIosPeople />, route: "/communities" },
  { name: "Profile", icon: <IoIosPerson />, route: "/profile" },
  { name: "More", icon: <IoIosMore /> },
];

const LeftSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState("Home");
  const user = useSelector((state: RootState) => state.user);
  const usernameID = localStorage.getItem("userID");

  const [userNameModal, setUserNameModal] = useState(true);

  const toggleUserNameModal = () => {
    setUserNameModal(!userNameModal);
  };

  const address = user?.address;

  const NAMESPACE = process.env.REACT_APP_UUID_NAMESPACE;

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = bannerItems.find((item) => item.route === currentPath);
    setActivePage(activeItem ? activeItem.name : "Home");
  }, [location.pathname]);

  const handleClick = (name: string, route: string | undefined) => {
    setActivePage(name);
    if (route) navigate(route);
  };

  const generateUserID = (address: any) => {
    if (!NAMESPACE) return;
    if (!address && !usernameID) {
      return (
        <>
          <UsernameModal
            isVisible={userNameModal}
            toggleUsernameModal={toggleUserNameModal}
          />
        </>
      );
    }
    if (usernameID) return;
    const uuid = uuidv5(address, NAMESPACE);
    const userID = `user_${uuid.slice(0, 8)}`;
    localStorage.setItem("userID", userID);
    return userID;
  };

  return (
    <div className="flex flex-col fixed border-r h-screen flex-shrink-0 w-80 border-gray-700">
      <div
        className="flex flex-col p-4 pl-12 gap-y-2"
        style={{ fontFamily: "Roboto", fontWeight: 300 }}
      >
        <div className="mb-2">
          <img src={logo} alt="logo" width={60} height={60} />
        </div>

        {bannerItems.map(({ name, icon, route }) => (
          <button
            key={name}
            onClick={() => handleClick(name, route)}
            className={`flex items-center gap-2 hover:text-blue-400 transition duration-300 text-xl ${
              activePage === name ? "text-blue-600 bg-gray-900" : "text-white"
            } p-2 rounded`}
          >
            <span className="text-4xl">{icon}</span>
            {name}
          </button>
        ))}

        <button
          className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition 
            duration-300 ease-in-out text-white p-3 px-16 mb-12 mr-5 rounded-full flex 
            items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          Post
        </button>

        <div className="flex items-center">
          <img
            src={user?.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5 bg-white"
          />
          <div className="flex flex-col text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">
              @{generateUserID(address) || usernameID}
            </p>
          </div>
          <div>
            <IoIosMore className="text-2xl ml-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
