require('dotenv').config();

const existingContractAddr = '0x99422317EcebbaE3Ff9F2b12012335A8aeBAF78f';

async function main() {
  const soul = await hre.ethers.getContractAt('Soul', existingContractAddr);

  const size = await soul.ownerOf(0);

  console.log(`this Soul has the size of ${size}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
