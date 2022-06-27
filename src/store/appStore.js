import { defineStore, acceptHMRUpdate } from 'pinia';

import { markRaw } from 'vue';

import { ethers } from 'ethers';

import { abi } from '../artifacts/contracts/SoulManager.sol/SoulManager.json';

const { VITE_SOUL_MANAGER_ADDR } = import.meta.env;

export const useAppStore = defineStore('app', {
  state: () => ({
    soulManager: null,
    souls: null,
    signerAddr: '',
    soulName: '',
    soulTicker: '',
    showMessage: false,
  }),
  actions: {
    async initSoulManager(signer) {
      console.log('im being fired');
      this.soulManager = markRaw(new ethers.Contract(VITE_SOUL_MANAGER_ADDR, abi, signer.value));
      this.signerAddr = await this.soulManager.signer.getAddress();
      await this.mapSouls();
      this.soulManager.on('SoulAdded', async (newSoul) => {
        console.log('new soul is added!: ', JSON.stringify(newSoul));
        await this.mapSouls();
      });
    },

    async mapSouls() {
      const rawSouls = await this.soulManager.getSouls(this.signerAddr);
      this.souls = rawSouls.map((soul) => ({
        soulName: soul[0],
        soulTicker: soul[1],
        soulAddress: soul[2],
      }));
    },

    async createNewSoul() {
      const createSoulTx = await this.soulManager.createSoul(this.soulName, this.soulTicker);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
