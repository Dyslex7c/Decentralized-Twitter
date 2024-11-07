import { useState, useCallback, useEffect } from "react";
import { Tweet } from "../types";
import { BigNumber, Contract } from "ethers";
import { toast } from "react-toastify";

const useBookmarkStatus = (tweets: Tweet[], contract: Contract | null) => {
  const [bookmarkCounts, setBookmarkCounts] = useState
  <Record<string, number>
  >({});
  const [bookmarkedTweets, setBookmarkedTweets] = useState<
    Record<string, boolean>
  >({});

  const fetchBookmarkCounts = useCallback(async () => {
    if (contract) {
      const counts: Record<string, number> = {};
      await Promise.all(
        tweets.map(async (tweet) => {
          const bigNumberTweetId = BigNumber.from(tweet.id);
          const count = await contract.getTotalBookmarks(
            tweet.author,
            bigNumberTweetId
          );
          counts[tweet.id] = count.toNumber();
        })
      );
      setBookmarkCounts(counts);
    }
  }, [contract, tweets]);

  useEffect(() => {
    fetchBookmarkCounts();
  }, [fetchBookmarkCounts]);

  const checkIfBookmarked = useCallback(async () => {
    if (contract) {
      const bookmarkedStatusPromises = tweets.map(async (tweet) => {
        const isBookmarked = await contract.hasUserBookmarked(
          tweet.author,
          tweet.id
        );
        return { id: tweet.id, bookmarked: isBookmarked };
      });
      const bookmarkedStatuses = await Promise.all(bookmarkedStatusPromises);
      const bookmarkedMap = bookmarkedStatuses.reduce(
        (acc, { id, bookmarked }) => ({ ...acc, [id]: bookmarked }),
        {}
      );
      setBookmarkedTweets(bookmarkedMap);
    }
  }, [contract, tweets]);

  const bookmarkTweet = async (tweetId: string, author: string) => {
    if (contract) {
      try {
        const bigNumberTweetId = BigNumber.from(tweetId);
        const transaction = await contract.bookmarkTweet(
          author,
          bigNumberTweetId
        );
        await transaction.wait();
        toast.success("You bookmarked the tweet!");
        fetchBookmarkCounts();
        checkIfBookmarked();
      } catch (error) {
        console.error("Error while bookmarking the tweet:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  const unbookmarkTweet = async (tweetId: string, author: string) => {
    if (contract) {
      try {
        const bigNumberTweetId = BigNumber.from(tweetId);
        const transaction = await contract.unbookmarkTweet(
          author,
          bigNumberTweetId
        );
        await transaction.wait();
        toast.error("You removed the bookmark from the tweet.");
        fetchBookmarkCounts();
        checkIfBookmarked();
      } catch (error) {
        console.error("Error while removing the bookmark:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  useEffect(() => {
    checkIfBookmarked();
  }, [checkIfBookmarked]);

  return { bookmarkCounts, bookmarkedTweets, bookmarkTweet, unbookmarkTweet };
};

export default useBookmarkStatus;
