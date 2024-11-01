import { useState, useCallback, useEffect } from "react";
import { BigNumber, Contract } from "ethers";
import { toast } from "react-toastify";

type Tweet = {
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

const useLikeStatus = (tweets: Tweet[], contract: Contract | null) => {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedTweets, setLikedTweets] = useState<Record<string, boolean>>({});

  const fetchLikeCounts = useCallback(async () => {
    if (contract) {
      const counts: Record<string, number> = {};
      await Promise.all(
        tweets.map(async (tweet) => {
          const bigNumberTweetId = BigNumber.from(tweet.id);
          const count = await contract.getTotalLikes(
            tweet.author,
            bigNumberTweetId
          );
          counts[tweet.id] = count.toNumber();
        })
      );
      setLikeCounts(counts);
    }
  }, [contract, tweets]);

  useEffect(() => {
    fetchLikeCounts();
  }, [fetchLikeCounts]);

  const checkIfLiked = useCallback(async () => {
    if (contract) {
      const likedStatusPromises = tweets.map(async (tweet) => {
        const isLiked = await contract.isLiked(tweet.author, tweet.id);
        return { id: tweet.id, liked: isLiked };
      });
      const likedStatuses = await Promise.all(likedStatusPromises);
      const likedMap = likedStatuses.reduce(
        (acc, { id, liked }) => ({ ...acc, [id]: liked }),
        {}
      );
      setLikedTweets(likedMap);
    }
  }, [contract, tweets]);

  const likeTweet = async (tweetId: string, author: string) => {
    if (contract) {
      try {
        const bigNumberTweetId = BigNumber.from(tweetId);
        const transaction = await contract.likeTweet(author, bigNumberTweetId);
        await transaction.wait();
        toast.success("You liked the tweet!");
        fetchLikeCounts();
        checkIfLiked();
      } catch (error) {
        console.error("Error while liking the tweet:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  const unlikeTweet = async (tweetId: string, author: string) => {
    if (contract) {
      try {
        const bigNumberTweetId = BigNumber.from(tweetId);
        const transaction = await contract.unlikeTweet(
          author,
          bigNumberTweetId
        );
        await transaction.wait();
        toast.error("You unliked the tweet");
        fetchLikeCounts();
        checkIfLiked();
      } catch (error) {
        console.error("Error while unliking the tweet:", error);
      }
    } else {
      toast.error("Contract is not available. Please connect your wallet.");
    }
  };

  useEffect(() => {
    checkIfLiked();
  }, [checkIfLiked]);

  return { likeCounts, likedTweets, likeTweet, unlikeTweet };
};

export default useLikeStatus;
