require('dotenv').config();

const recipientSoulAddr = '0x8acF656F48718d0b0B4ABcB60707216D61273Eff';
const senderSoulAddr = '0x99422317EcebbaE3Ff9F2b12012335A8aeBAF78f';

const { IPFS_CID_ONE, IPFS_CID_TWO } = process.env;

async function main() {
  const recipientSoul = await hre.ethers.getContractAt('Soul', recipientSoulAddr);

  const senderSoul = await hre.ethers.getContractAt('Soul', senderSoulAddr, ethers.provider.getSigner(1));
  console.log(`senderSoul : ${senderSoul.address}`);

  const approvalTx = await recipientSoul.acceptApproval(senderSoulAddr);
  await approvalTx.wait();

  const tokenURI = `https://gateway.ipfs.io/ipfs/${IPFS_CID_TWO}`;
  const mintTx = await senderSoul.issueSBT(recipientSoulAddr, tokenURI);

  await mintTx.wait();

  console.log('Minting is complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
