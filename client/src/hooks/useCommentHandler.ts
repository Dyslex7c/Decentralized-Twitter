import { useState, useCallback, useEffect } from "react";
import { Contract } from "ethers";
import { toast } from "react-toastify";

type Tweet = {
  id: string;
  author: string;
};

interface Comment {
  comment: string;
}

interface User {
  name: string;
  avatar: string;
}

const useCommentHandler = (tweets: Tweet[], contract: Contract | null) => {
  const [totalComments, setTotalComments] = useState<Record<string, number>>(
    {}
  );
  const [hasUserCommented, setHasUserCommented] = useState<
    Record<string, boolean>
  >({});

  const handleSetComment = async (
    tweet: Tweet | undefined,
    user: User | null,
    userID: string | null,
    comment: Comment,
    mediaCID: string | null,
    toggleCommentModal: () => void
  ) => {
    if (contract) {
      const transaction = await contract.addComment(
        tweet?.author,
        tweet?.id,
        user?.name,
        userID,
        user?.avatar,
        comment.comment,
        mediaCID || ""
      );
      await transaction.wait();
      toast.success("Comment added successfully!");
      fetchTotalComments();
      checkIfUserCommented();
      toggleCommentModal();
    }
  };

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

  return { handleSetComment, totalComments, hasUserCommented };
};

export default useCommentHandler;
