require('dotenv').config();

const { expect } = require('chai');
const { ethers } = require('hardhat');

const { IPFS_CID_ONE, IPFS_CID_TWO } = process.env;

const tokenURIOne = `https://gateway.ipfs.io/ipfs/${IPFS_CID_ONE}`;
const tokenURITwo = `https://gateway.ipfs.io/ipfs/${IPFS_CID_TWO}`;

describe('SoulManager', () => {
  let soulManager;
  let deployer;
  let userOne;
  let userTwo;
  let userOneCon;
  let userTwoCon;
  beforeEach(async () => {
    [deployer, userOne, userTwo] = await ethers.getSigners();
    const SoulManager = await ethers.getContractFactory('SoulManager', deployer);
    soulManager = await SoulManager.deploy();
    userOneCon = await soulManager.connect(userOne);
    userTwoCon = await soulManager.connect(userTwo);
  });

  it('should be able to create a new Soul contract bound to the owner address', async () => {
    const soulId = 0;
    const soulName = 'Credentials Soul';
    const soulTicker = 'CSL';
    const tx = userOneCon.createSoul(soulName, soulTicker);
    const soulAddr = await userOneCon.getSoul(soulId);

    await expect(tx).to.emit(userOneCon, 'SoulAdded')
      .withArgs(soulId, soulName, soulTicker, soulAddr);
  });

  it('user should be able to create multiple souls', async () => {
    for (let i = 0; i < 5; i += 1) {
      const tx = await userOneCon.createSoul('Health Soul', 'HSL');
      await tx.wait();
    }

    for (let i = 0; i < 3; i += 1) {
      const tx = await userTwoCon.createSoul('Health Soul', 'HSL');
      await tx.wait();
    }

    const userOneSouls = await soulManager.getSouls(await userOne.getAddress());
    const userTwoSouls = await soulManager.getSouls(await userTwo.getAddress());

    expect(userOneSouls.length).to.equal(5);
    expect(userTwoSouls.length).to.equal(3);
  });

  it('user should be able to add pending tokens to soul  manager', async () => {
    const tx1 = await userOneCon.createSoul('Arizona State University', 'ASU');
    const tx2 = await userTwoCon.createSoul('VictorCredentials', 'VCW');
    const tx1Receipt = await tx1.wait();
    const tx2Receipt = await tx2.wait();
    const [issuerSoulAddress, recipientSoulAddress] = [tx1Receipt, tx2Receipt]
      .map(({ events }) => events[0].args[3]);

    const issuerSoul = await ethers.getContractAt('Soul', issuerSoulAddress, userOne);
    const recipientSoul = await ethers.getContractAt('Soul', recipientSoulAddress, userTwo);
    const txToken = await issuerSoul.issuePendingSBT(recipientSoulAddress, tokenURIOne);
    await txToken.wait();
    const expectedTokenUri = ethers.utils.id(tokenURIOne);
    const actualTokenUri = await soulManager.getApproval(issuerSoulAddress, recipientSoulAddress);

    expect(expectedTokenUri).to.equal(actualTokenUri);

    const payload = ethers.utils.defaultAbiCoder
      .encode(['address', 'address', 'string'], [recipientSoulAddress, issuerSoulAddress, tokenURIOne]);
    const payloadHash = ethers.utils.keccak256(payload);
    const signature = await userTwo.signMessage(ethers.utils.arrayify(payloadHash));

    const revertedSignature = await userOne.signMessage(ethers.utils.arrayify(payloadHash));
    const sig = ethers.utils.splitSignature(signature);
    const recovered = ethers.utils.verifyMessage(ethers.utils.arrayify(payloadHash), sig);
    const contractOwner = await recipientSoul.getOwner();
    console.log({
      contractOwner,
      payload,
      payloadHash,
      recipientSoulAddress,
      signature,
      recovered,
    });

    const claimTx = await recipientSoul.claimSBT(issuerSoulAddress, tokenURIOne, signature);
    await expect(claimTx).to.emit(recipientSoul, 'TokenReceived')
      .withArgs(issuerSoulAddress, recipientSoulAddress, 0, tokenURIOne);

    const wrongCliamTx = recipientSoul.claimSBT(issuerSoulAddress, tokenURIOne, revertedSignature);

    await expect(wrongCliamTx).to.be.revertedWith('INVALID_SIGNATURE');
  });

  it('tryin to release non-approved tokenURI should be reverted', async () => {
    const tx1 = await userOneCon.createSoul('Arizona State University', 'ASU');
    const tx2 = await userTwoCon.createSoul('VictorCredentials', 'VCW');
    const tx1Receipt = await tx1.wait();
    const tx2Receipt = await tx2.wait();
    const [issuerSoulAddress, recipientSoulAddress] = [tx1Receipt, tx2Receipt]
      .map(({ events }) => events[0].args[3]);

    const recipientSoul = await ethers.getContractAt('Soul', recipientSoulAddress, userTwo);

    const payload = ethers.utils.defaultAbiCoder
      .encode(['address', 'address', 'string'], [recipientSoulAddress, issuerSoulAddress, tokenURIOne]);
    const payloadHash = ethers.utils.keccak256(payload);
    const signature = await userTwo.signMessage(ethers.utils.arrayify(payloadHash));

    const claimTx = recipientSoul.claimSBT(issuerSoulAddress, tokenURIOne, signature);

    await expect(claimTx).to.be.revertedWith('releaseSBT: invalid tokenURI');
  });
});
