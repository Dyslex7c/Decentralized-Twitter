async function deployFollowSystem() {
  const FollowSystem = await hre.ethers.getContractFactory("FollowSystem");

  const followSystem = await FollowSystem.deploy();

  await followSystem.deployed();

  console.log(`FollowSystem deployed to: ${followSystem.address}`);
}

deployFollowSystem()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
