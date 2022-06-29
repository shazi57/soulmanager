require('dotenv').config();

const existingContractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const signerAddr = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

async function main() {
  const soulManager = await hre.ethers.getContractAt('SoulManager', existingContractAddr);
  const souls = await soulManager.getSouls(signerAddr);
  console.log(souls);
  // console.log(`this Soul has the size of ${size}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
