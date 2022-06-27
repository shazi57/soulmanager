const { ethers } = require('hardhat');

async function main() {
  const SoulManager = await hre.ethers.getContractFactory('SoulManager', await ethers.provider.getSigner(0));
  const soulManager = await SoulManager.deploy();

  console.log('Soul Manager is deployed to:', soulManager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
