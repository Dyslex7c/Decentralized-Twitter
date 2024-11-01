import { useState, useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { v5 as uuidv5 } from "uuid";
import { createPopper } from "@popperjs/core";
import { FaPlus } from "react-icons/fa";
import { clearUser } from "../../state";
import { RootState } from "../../store";
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState("Home");
  const user = useSelector((state: RootState) => state.user);
  const usernameID = localStorage.getItem("userID");

  const [userNameModal, setUserNameModal] = useState(true);
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);

  const btnDropdownRef = useRef<HTMLButtonElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);

  const address = user?.address;
  const NAMESPACE = process.env.REACT_APP_UUID_NAMESPACE;

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = bannerItems.find((item) => item.route === currentPath);
    setActivePage(activeItem ? activeItem.name : "Home");
  }, [location.pathname]);

  const generateUserID = (address: any) => {
    if (!NAMESPACE) return;
    if (!address && !usernameID) {
      return (
        <UsernameModal
          isVisible={userNameModal}
          toggleUsernameModal={() => setUserNameModal(!userNameModal)}
        />
      );
    }
    if (usernameID) return;
    const uuid = uuidv5(address, NAMESPACE);
    const userID = `user_${uuid.slice(0, 8)}`;
    localStorage.setItem("userID", userID);
    return userID;
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("userID");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownPopoverShow((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverDropdownRef.current &&
      !popoverDropdownRef.current.contains(event.target as Node) &&
      btnDropdownRef.current &&
      !btnDropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownPopoverShow(false);
    }
  };

  useEffect(() => {
    if (dropdownPopoverShow) {
      createPopper(btnDropdownRef.current!, popoverDropdownRef.current!, {
        placement: "top-end",
        modifiers: [
          { name: "offset", options: { offset: [0, -10] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownPopoverShow]);

  return (
    <div className="flex flex-col fixed border-r h-screen flex-shrink-0 w-20 lg:w-80 border-gray-700">
      <div
        className="flex flex-col p-3 lg:p-4 lg:pl-12 gap-y-2"
        style={{ fontFamily: "Roboto", fontWeight: 300 }}
      >
        <div className="mb-2">
          <img src={logo} alt="logo" width={60} height={60} />
        </div>

        {bannerItems.map(({ name, icon, route }) => (
          <button
            key={name}
            onClick={() => {
              setActivePage(name);
              if (route) navigate(route);
            }}
            className={`flex items-center gap-2 hover:text-blue-400 transition duration-300 text-xl ${
              activePage === name ? "text-blue-600 bg-gray-900" : "text-white"
            } p-2 rounded`}
          >
            <span className="text-4xl">{icon}</span>
            <span className="hidden lg:block">{name}</span>
          </button>
        ))}

        <button
          className="bg-[#345eeb] hover:bg-[#78c7ff] hover:text-black transition duration-300 ease-in-out text-white ml-1 p-3 px-6 lg:px-16 mb-12 mr-5 rounded-full flex items-center justify-center gap-2"
          style={{ fontWeight: 600 }}
        >
          Post
        </button>

        <div className="relative flex items-center p-2">
          <img
            src={user?.avatar}
            alt="avatar"
            height={40}
            width={40}
            className="rounded-full mr-5 bg-white"
          />
          <div className="hidden lg:block flex-col text-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="text-gray-500">
              @{generateUserID(address) || usernameID}
            </p>
          </div>

          <button
            ref={btnDropdownRef}
            onClick={toggleDropdown}
            className="relative hidden lg:block"
          >
            <IoIosMore className="text-2xl ml-16" />
          </button>

          <div
            ref={popoverDropdownRef}
            className={`${
              dropdownPopoverShow ? "block animate-fade-in" : "hidden"
            } absolute shadow-lg shadow-blue-500 rounded py-2 bg-black`}
            style={{ minWidth: "12rem", top: "-20px", right: 0 }}
          >
            <button
              className="text-sm py-4 px-4 font-normal block w-full whitespace-nowrap hover:bg-gray-700 transition duration-300"
              onClick={handleLogout}
            >
              Log out @{usernameID}
            </button>
            <div className="h-0 border-t border-blue-500 opacity-25" />
            <button className="flex items-center gap-4 py-2 px-4">
              <p>Add an existing account</p>
              <FaPlus className="p-1 text-lg bg-blue-600 rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
