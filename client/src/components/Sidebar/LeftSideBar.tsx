import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const bannerItems = [
  { name: "Home", icon: <IoIosHome />, route: "/home" },
  { name: "Explore", icon: <IoIosSearch />, route: "/explore" },
  { name: "Notifications", icon: <IoIosNotifications /> },
  { name: "Messages", icon: <IoIosChatboxes /> },
  { name: "Communities", icon: <IoIosPeople /> },
  { name: "Profile", icon: <IoIosPerson /> },
  { name: "More", icon: <IoIosMore /> },
];

const LeftSideBar = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Home");

  const handleClick = (name: string, route: string | undefined) => {
    setActivePage(name);
    if (route) navigate(route);
  };

  return (
    <div className="flex flex-col border-r h-screen flex-shrink-0 border-gray-700">
      <div
        className="flex flex-col p-4 pl-12 gap-y-4"
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
              activePage === name ? "text-blue-600" : "text-white"
            }`}
          >
            <span className="text-4xl">{icon}</span>
            {name}
          </button>
        ))}

        <button
          className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition 
            duration-300 ease-in-out text-white p-3 px-16 mb-20 mr-5 rounded-full flex 
            items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          Post
        </button>

        <div className="flex items-center">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5"
          />
          <div className="flex flex-col text-sm">
            <p className="font-bold">John Doe</p>
            <p className="text-gray-500">@username</p>
          </div>
          <div>
            <IoIosMore className="text-2xl ml-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
