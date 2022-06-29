import { defineStore, acceptHMRUpdate } from 'pinia';
import { markRaw } from 'vue';

import { ethers } from 'ethers';

import { abi as soulManagerAbi } from '../artifacts/contracts/SoulManager.sol/SoulManager.json';
import { abi as soulAbi } from '../artifacts/contracts/Soul.sol/Soul.json';

const { VITE_SOUL_MANAGER_ADDR } = import.meta.env;

export const useAppStore = defineStore('app', {
  state: () => ({
    soulManager: null,
    souls: null,
    signer: null,
    openModal: false,
    selectedSoul: null,
    recipientSoulAddr: '',
    issuerSoulAddr: '',
    ipfsCID: '',
    isLoading: false,
    soulName: '',
    soulTicker: '',
    option: '',
    showMessage: false,
    tokenAlarm: false,
  }),
  getters: {
    dropDownPH: (state) => {
      if (state.option === 'other') {
        return 'Issuer Soul';
      }
      return 'Recipient Soul';
    },
    formTitle: (state) => {
      switch (state.option) {
        case 'self':
          return 'Issue SBT to my own Soul';
        case 'other':
          return "Issue SBT to other's Soul";
        case 'claim':
          return "Claim your SBT from issuer's Soul";
        default:
          return '';
      }
    },
    ipfsURI: (state) => (`https://ipfs.io/ipfs/${state.ipfsCID}`),
    soulOptions: (state) => state.souls.map((soul) => (
      { name: `${soul.soulName} - ${soul.soulAddress}`, code: `${soul.soulAddress}` }
    )),
  },
  actions: {
    setTokenAlarmFalse() {
      this.tokenAlarm = false;
    },
    setLoadingFalse() {
      this.isLoading = false;
    },
    async issuePendingSBT() {
      const soulContract = new ethers.Contract(this.selectedSoul, soulAbi, this.signer);
      await soulContract.issuePendingSBT(this.recipientSoulAddr, this.ipfsURI);
      this.openModal = false;
    },
    async issueSBTtoSelf() {
      const soulContract = new ethers.Contract(this.selectedSoul, soulAbi, this.signer);
      await soulContract.issueSBTtoSelf(this.ipfsURI);
      this.openModal = false;
      this.isLoading = true;
    },

    async claimSBT() {
      const soulContract = new ethers.Contract(this.selectedSoul, soulAbi, this.signer);
      const payload = ethers.utils.defaultAbiCoder
        .encode(['address', 'address', 'string'], [this.selectedSoul, this.issuerSoulAddr, this.ipfsURI]);
      const payloadHash = ethers.utils.keccak256(payload);
      const signature = await this.signer.signMessage(ethers.utils.arrayify(payloadHash));
      await soulContract.claimSBT(this.issuerSoulAddr, this.ipfsURI, signature);
      this.openModal = false;
      this.isLoading = true;
    },
    async displayModal({ option }) {
      this.openModal = true;
      this.option = option;
    },

    async removeAllListeners() {
      await this.soulManager.removeAllListeners();
    },
    async initSoulManager(signer) {
      this.soulManager = markRaw(
        new ethers.Contract(VITE_SOUL_MANAGER_ADDR, soulManagerAbi, signer.value),
      );
      this.signer = this.soulManager.signer;
      await this.mapSouls();
      this.soulManager.on('SoulAdded', async (id, name, ticker, addr) => {
        await this.mapSouls();
      });
      this.appLoaded = true;
    },

    async mapSouls() {
      const signerAddr = await this.signer.getAddress();
      const rawSouls = await this.soulManager.getSouls(signerAddr);
      const promises = Promise.all(rawSouls.map(async (addr) => {
        const soulContract = new ethers.Contract(addr, soulAbi, this.signer);
        return {
          soulName: await soulContract.name(),
          soulTicker: await soulContract.symbol(),
          soulAddress: addr,
        };
      }));
      this.souls = await promises;
    },

    async createNewSoul() {
      this.isLoading = true;
      await this.soulManager.createSoul(this.soulName, this.soulTicker);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
