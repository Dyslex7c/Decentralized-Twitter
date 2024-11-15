import { Tweet } from "../types";

export const mergeSortTweets = (
  tweets: Tweet[],
  likeCounts: any,
  totalComments: any,
  repostCounts: any
): Tweet[] => {
  if (tweets.length <= 1) return tweets;

  const mid = Math.floor(tweets.length / 2);
  const left = mergeSortTweets(
    tweets.slice(0, mid),
    likeCounts,
    totalComments,
    repostCounts
  );
  const right = mergeSortTweets(
    tweets.slice(mid),
    likeCounts,
    totalComments,
    repostCounts
  );

  return merge(left, right, likeCounts, totalComments, repostCounts);
};

const merge = (
  left: Tweet[],
  right: Tweet[],
  likeCounts: Record<string, number>,
  commentCounts: Record<string, number>,
  repostCounts: Record<string, number>
): Tweet[] => {
  const sorted: Tweet[] = [];

  while (left.length && right.length) {
    const leftTweet = left[0];
    const rightTweet = right[0];

    if (
      isHigherPriority(
        leftTweet,
        rightTweet,
        likeCounts,
        commentCounts,
        repostCounts
      )
    ) {
      sorted.push(left.shift()!);
    } else {
      sorted.push(right.shift()!);
    }
  }

  return [...sorted, ...left, ...right];
};

const isHigherPriority = (
  tweetA: Tweet,
  tweetB: Tweet,
  likeCounts: Record<string, number>,
  commentCounts: Record<string, number>,
  repostCounts: Record<string, number>
): boolean => {
  const likesA = likeCounts[tweetA.id] || 0;
  const likesB = likeCounts[tweetB.id] || 0;

  const commentsA = commentCounts[tweetA.id] || 0;
  const commentsB = commentCounts[tweetB.id] || 0;

  const repostsA = repostCounts[tweetA.id] || 0;
  const repostsB = repostCounts[tweetB.id] || 0;

  if (likesA !== likesB) return likesA > likesB;
  if (commentsA !== commentsB) return commentsA > commentsB;
  return repostsA > repostsB;
};
