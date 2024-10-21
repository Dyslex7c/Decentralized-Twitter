import React, { useState } from "react";
import ForYouContent from "../components/Layout/ForYouContent";
import FollowingContent from "../components/Layout/FollowingContent";

const HomePage = () => {
  const [activeComponent, setActiveComponent] = useState("foryou");

  return (
    <div className="flex flex-col w-3/5 h-screen border-r border-gray-700">
      <div className="flex justify-evenly border-b border-gray-700 text-gray-400 sticky top-0 bg-black z-10">
        <button onClick={() => setActiveComponent("foryou")} className="w-1/2">
          <div
            className={`p-4 text-center border-b border-gray-700 hover:border-white transition duration-300 ${
              activeComponent === "foryou" &&
              "text-white font-bold border-b-2 border-blue-600"
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
            className={`p-4 text-center border-b border-gray-700 hover:border-white transition duration-300 ${
              activeComponent === "following" &&
              "text-white font-bold border-b-2 border-blue-600"
            }`}
            style={{ fontFamily: "Prompt" }}
          >
            Following
          </div>
        </button>
      </div>

      <div className="flex-grow p-6">
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
