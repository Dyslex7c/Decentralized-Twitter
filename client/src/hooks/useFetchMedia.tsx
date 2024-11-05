import { BigNumber } from "ethers";
import { useState, useEffect, useCallback } from "react";

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

type MediaElements = {
  [key: string]: JSX.Element | null;
};

const useFetchMedia = (
  tweets: Tweet[] | []
): { mediaElements: MediaElements } => {
  const [mediaElements, setMediaElements] = useState<MediaElements>({});

  const fetchMedia = useCallback(async () => {
    const mediaPromises = tweets.map(async (tweet) => {
      if (!tweet.mediaCID) return { id: tweet.id, element: null };

      const url = `https://gateway.pinata.cloud/ipfs/${tweet.mediaCID}`;
      try {
        const response = await fetch(url, { method: "HEAD" });
        const mimeType = response.headers.get("Content-Type") || "";

        let element: JSX.Element;
        if (mimeType.startsWith("video")) {
          element = (
            <video controls width="500" className="rounded-xl mt-3">
              <source src={url} type={mimeType} />
              Your browser does not support the video tag.
            </video>
          );
        } else if (mimeType.startsWith("image")) {
          element = (
            <img
              src={url}
              alt="post-media"
              width={500}
              className="rounded-xl mt-3"
            />
          );
        } else {
          element = <span></span>;
        }
        return { id: tweet.id, element };
      } catch {
        return { id: tweet.id, element: <span></span> };
      }
    });

    const results = await Promise.all(mediaPromises);
    const mediaMap: MediaElements = {};
    results.forEach(({ id, element }) => {
      mediaMap[id] = element;
    });
    setMediaElements(mediaMap);
  }, [tweets]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { mediaElements };
};

export default useFetchMedia;
