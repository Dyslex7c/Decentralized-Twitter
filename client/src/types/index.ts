import { BigNumber } from "ethers";

export type Tweet = {
  date: number;
  month: string;
  id: string;
  name: string;
  avatar: string;
  author: string;
  authorID: string;
  content: string;
  mediaCID: string;
  timestamp: BigNumber;
};
