require('dotenv').config();

const existingContractAddr = '0x8acF656F48718d0b0B4ABcB60707216D61273Eff';

async function main() {
  const soul = await hre.ethers.getContractAt('Soul', existingContractAddr);

  const size = await soul.size();

  console.log(`this Soul has the size of ${size}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
