const hre = require("hardhat");

async function main() {
  const PostTweet = await hre.ethers.getContractFactory("PostTweet");

  const twitter = await PostTweet.deploy();

  await twitter.deployed();

  console.log(`PostTweet deployed to: ${twitter.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
