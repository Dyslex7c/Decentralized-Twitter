import { useState, useCallback, useEffect } from "react";
import { Tweet } from "../types";
import { BigNumber, Contract } from "ethers";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface User {
  name: string;
  avatar: string;
}

const useRepostStatus = (tweets: Tweet[], contract: Contract | null) => {
  const user = useSelector((state: RootState) => state.user);
  const [repostCounts, setRepostCounts] = useState<Record<string, number>>({});
  const [repostedTweets, setRepostedTweets] = useState<Record<string, boolean>>(
    {}
  );

  const fetchRepostCounts = useCallback(async () => {
    if (contract) {
      const counts: Record<string, number> = {};
      await Promise.all(
        tweets.map(async (tweet) => {
          const bigNumberTweetId = BigNumber.from(tweet.id);
          try {
            const count = await contract.getTotalReposts(
              tweet.author,
              bigNumberTweetId
            );
            counts[tweet.id] = count.toNumber();
          } catch (error) {
            console.error(
              `Error fetching repost count for tweet ID ${tweet.id}:`,
              error
            );
          }
        })
      );
      setRepostCounts(counts);
    }
  }, [contract, tweets]);

  useEffect(() => {
    fetchRepostCounts();
  }, [fetchRepostCounts]);

  const checkIfUserReposted = useCallback(async () => {
    if (contract) {
      const repostedStatusPromises = tweets.map(async (tweet) => {
        try {
          const isReposted = await contract.hasUserReposted(
            user?.address,
            tweet.author,
            tweet.id
          );
          return { id: tweet.id, reposted: isReposted };
        } catch (error) {
          console.error(
            `Error checking repost status for tweet ID ${tweet.id}:`,
            error
          );
          return { id: tweet.id, reposted: false };
        }
      });
      const repostedStatuses = await Promise.all(repostedStatusPromises);
      const repostedMap = repostedStatuses.reduce(
        (acc, { id, reposted }) => ({ ...acc, [id]: reposted }),
        {}
      );
      setRepostedTweets(repostedMap);
    }
  }, [contract, tweets, user]);

  const repostTweet = async (
    tweet: Tweet,
    user: User | null,
    currentUserID: string | null
  ) => {
    if (contract && user) {
      try {
        const transaction = await contract.repostTweet(
          tweet.id,
          user.name,
          currentUserID,
          user.avatar
        );
        await transaction.wait();
        toast.success("Tweet reposted successfully!");
        fetchRepostCounts();
        checkIfUserReposted();
      } catch (error) {
        console.error("Error reposting tweet:", error);
        toast.error("Failed to repost tweet. Please try again.");
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  useEffect(() => {
    checkIfUserReposted();
  }, [checkIfUserReposted]);

  return { repostCounts, repostedTweets, repostTweet };
};

export default useRepostStatus;
