const hre = require("hardhat");

async function main() {
  const followSystemAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const PostTweet = await hre.ethers.getContractFactory("PostTweet");

  const twitter = await PostTweet.deploy(followSystemAddress);

  await twitter.deployed();

  console.log(`PostTweet deployed to: ${twitter.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
