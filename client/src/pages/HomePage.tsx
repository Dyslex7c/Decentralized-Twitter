import { useState } from "react";
import ForYouContent from "../components/Layout/ForYouContent";
import FollowingContent from "../components/Layout/FollowingContent";

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState("foryou");
  const userID = localStorage.getItem("userID");

  if (!userID) return null;

  return (
    <div className="flex flex-col sm:w-3/5 h-screen">
      <div className="flex justify-evenly text-gray-400 sticky top-0 bg-black z-10">
        <button onClick={() => setActiveComponent("foryou")} className="w-1/2">
          <div
            className={`p-4 text-center hover:border-white transition duration-300 ${
              activeComponent === "foryou"
                ? "text-white font-bold border-b-2 border-blue-600"
                : "border-b border-gray-700"
            }`}
            style={{ fontFamily: "Prompt" }}
          >
            For You
          </div>
        </button>
        <button
          onClick={() => setActiveComponent("following")}
          className="w-1/2"
        >
          <div
            className={`p-4 text-center border-r hover:border-b-white transition duration-300 ${
              activeComponent === "following"
                ? "text-white font-bold border-b-2 border-blue-600"
                : "border-b border-gray-700"
            }`}
            style={{ fontFamily: "Prompt" }}
          >
            Following
          </div>
        </button>
      </div>

      <div className="flex-grow py-6 border-r border-gray-700">
        {activeComponent === "foryou" ? (
          <ForYouContent />
        ) : (
          <FollowingContent />
        )}
      </div>
    </div>
  );
};

export default HomePage;
