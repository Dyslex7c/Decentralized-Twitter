import { MdModeComment, MdOutlineModeComment } from "react-icons/md";
import { BiBookmark, BiLike, BiRepost, BiSolidLike } from "react-icons/bi";
import { SiGoogleanalytics } from "react-icons/si";
import { Tweet } from "../types";

type InteractionIcon = {
  icon: JSX.Element;
  iconActivated?: JSX.Element;
  label: string;
  color: string;
  hoverColor: string;
  action: (tweet: Tweet) => void;
};

export const createInteractionIcons = (
  handleComment: (tweet: Tweet) => void,
  handleRepost: (tweet: Tweet) => void,
  handleLike: (tweet: Tweet) => void,
  handleAnalytics: (tweet: Tweet) => void,
  handleBookmark: (tweet: Tweet) => void
): InteractionIcon[] => [
  {
    icon: <MdOutlineModeComment />,
    iconActivated: <MdModeComment />,
    label: "Comment",
    color: "text-blue-400",
    hoverColor: "hover:text-blue-400",
    action: handleComment,
  },
  {
    icon: <BiRepost />,
    iconActivated: <BiRepost />,
    label: "Repost",
    color: "text-green-400",
    hoverColor: "hover:text-green-400",
    action: handleRepost,
  },
  {
    icon: <BiLike />,
    iconActivated: <BiSolidLike />,
    label: "Like",
    color: "text-rose-400",
    hoverColor: "hover:text-rose-400",
    action: handleLike,
  },
  {
    icon: <SiGoogleanalytics />,
    label: "Analytics",
    color: "text-blue-400",
    hoverColor: "hover:text-blue-400",
    action: handleAnalytics,
  },
  {
    icon: <BiBookmark />,
    label: "Bookmark",
    color: "text-blue-400",
    hoverColor: "hover:text-blue-400",
    action: handleBookmark,
  },
];
