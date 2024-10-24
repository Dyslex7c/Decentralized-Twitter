import chai from "chai";
import hre from "hardhat";
import { Contract, Event, Signer, BigNumber } from "ethers";

const { expect } = chai;

type TweetPostedEventArgs = {
  tweetId: BigNumber;
  author: string;
  content: string;
};

describe("PostTweet", () => {
  let postTweet: Contract;
  let owner: Signer;
  let addr1: Signer;

  it("should post a tweet", async function () {
    const PostTweet = await (hre as any).ethers.getContractFactory("PostTweet");
    postTweet = await PostTweet.deploy();
    await postTweet.deployed();
    [owner, addr1] = await (hre as any).ethers.getSigners();
    const content = "Hello, decentralized X!";
    const mediaCID = "QmSomeRandomMediaCID123";

    const tx = await postTweet.postTweet(content, mediaCID);
    const receipt = await tx.wait();

    const tweetEvent: Event | undefined = receipt.events?.find((e: Event) => e.event === "TweetPosted");

    if (tweetEvent) {
      const args = tweetEvent.args as unknown as TweetPostedEventArgs;

      expect(args.tweetId.toNumber()).to.equal(0);
      expect(args.author).to.equal(await owner.getAddress());
      expect(args.content).to.equal(content);
    }
  });

  it("should retrieve tweets by user", async function () {
    const tweets = await postTweet.getTweetsByUser(await owner.getAddress());

    expect(tweets.length).to.equal(1);
    expect(tweets[0].content).to.equal("Hello, decentralized X!");
    expect(tweets[0].mediaCID).to.equal("QmSomeRandomMediaCID123");
  });

  it("should prevent empty tweets", async function () {
    try {
      await postTweet.postTweet("", "QmMediaCID");
      expect.fail("Expected postTweet to throw an error");
    } catch (error: any) {
      expect(error.message).to.include("Tweet content cannot be empty");
    }
  });

  it("should allow multiple users to post tweets", async function () {
    const addr1Content = "Another user's tweet!";
    const addr1CID = "QmAnotherCID";

    await postTweet.connect(addr1).postTweet(addr1Content, addr1CID);
    const tweets = await postTweet.getTweetsByUser(await addr1.getAddress());

    expect(tweets.length).to.equal(1);
    expect(tweets[0].content).to.equal(addr1Content);
    expect(tweets[0].mediaCID).to.equal(addr1CID);
  });
});
