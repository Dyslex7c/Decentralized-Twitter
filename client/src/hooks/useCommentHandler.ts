import { useState, useCallback, useEffect } from "react";
import { Contract } from "ethers";
import { toast } from "react-toastify";

type Tweet = {
  id: string;
  author: string;
};

const useCommentHandler = (tweets: Tweet[], contract: Contract | null) => {
  const [totalComments, setTotalComments] = useState<Record<string, number>>(
    {}
  );
  const [hasUserCommented, setHasUserCommented] = useState<
    Record<string, boolean>
  >({});

  const fetchTotalComments = useCallback(async () => {
    if (contract) {
      const counts: Record<string, number> = {};
      try {
        await Promise.all(
          tweets.map(async (tweet) => {
            const commentCount = await contract.getTotalComments(
              tweet.author,
              tweet.id
            );
            counts[tweet.id] = commentCount.toNumber();
          })
        );
        setTotalComments(counts);
      } catch (error) {
        console.error("Error fetching total comments:", error);
        toast.error("Failed to fetch total comments.");
      }
    }
  }, [contract, tweets]);

  const checkIfUserCommented = useCallback(async () => {
    if (contract) {
      const statuses: Record<string, boolean> = {};
      try {
        await Promise.all(
          tweets.map(async (tweet) => {
            const userHasCommented = await contract.hasUserCommented(
              tweet.author,
              tweet.id
            );
            statuses[tweet.id] = userHasCommented;
          })
        );
        setHasUserCommented(statuses);
      } catch (error) {
        console.error("Error checking user comment status:", error);
        toast.error("Failed to check if you have commented.");
      }
    }
  }, [contract, tweets]);

  useEffect(() => {
    fetchTotalComments();
    checkIfUserCommented();
  }, [fetchTotalComments, checkIfUserCommented]);

  return { totalComments, hasUserCommented };
};

export default useCommentHandler;
