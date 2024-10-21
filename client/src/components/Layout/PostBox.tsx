import { useState } from "react";
import {
  MdOutlineGif,
  MdOutlinePermMedia,
  MdOutlineSchedule,
  MdPoll,
} from "react-icons/md";
import { FaUserSecret } from "react-icons/fa";

const icons = [
    { icon: <MdOutlinePermMedia />, tooltip: "Attach Media" },
    { icon: <MdOutlineGif />, tooltip: "Attach GIF" },
    { icon: <MdPoll />, tooltip: "Create Poll" },
    { icon: <FaUserSecret />, tooltip: "Post Anonymously" },
    { icon: <MdOutlineSchedule />, tooltip: "Schedule Post" },
  ];

const PostBox = () => {
  const [text, setText] = useState("");
  const [postType, setPostType] = useState("Mutable");

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "40px";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(event.target.value);
  };

  return (
    <div className="flex flex-col relative">
      <div className="absolute top-2 right-4">
        <select
          value={postType}
          onChange={(event) => setPostType(event.target.value)}
          className="bg-black text-white border border-gray-700 p-1 rounded"
        >
          <option value="Mutable">Mutable</option>
          <option value="Immutable">Immutable</option>
        </select>
      </div>

      <div className="flex flex-row items-start border-b border-gray-700 p-3">
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="user"
          width={40}
          height={40}
          className="rounded-full"
        />
        <textarea
          placeholder="What's your Proof of Activity?"
          className="bg-black text-xl ml-1 w-96 resize-none placeholder-gray-500 p-2 overflow-hidden focus:outline-none"
          style={{ height: "48px", paddingTop: "10px" }}
          value={text}
          onChange={handleInput}
        />
      </div>

      <div className="flex flex-row items-center mt-4 ml-16 gap-2">
      {icons.map((item, index) => (
        <span key={index} className="relative group text-2xl cursor-pointer">
          {item.icon}
          <span className="absolute top-8 -left-7 w-max px-2 py-1 text-xs bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {item.tooltip}
          </span>
        </span>
      ))}
    </div>

      {postType === "Immutable" && (
        <p className="text-[#ff0000] text-sm mt-8">
          Warning: Posts flagged as immutable are permanent and cannot be
          modified or deleted once submitted. Refrain from posting stuff which
          you're gonna delete anyway, such as casual selfies and pictures from
          your honeymoon.
        </p>
      )}
    </div>
  );
};

export default PostBox;
