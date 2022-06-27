import { defineStore, acceptHMRUpdate } from 'pinia';

import { markRaw } from 'vue';

import { ethers } from 'ethers';
import { useAppStore } from './appStore';

import { abi } from '../artifacts/contracts/Soul.sol/Soul.json';

const { VITE_SOUL_MANAGER_ADDR } = import.meta.env;

export const useSoulStore = defineStore('Soul', {
  state: () => ({
    mySbts: [],
    soulAddr: null,
    sbts: [],
  }),
  actions: {
    async fetchSBTs(contractAddr) {
      const appStore = useAppStore();
      const { signer } = appStore.soulManager;
      console.log(signer);
      console.log(contractAddr);
      this.soulAddr = markRaw(new ethers.Contract(contractAddr, abi, signer));
      this.sbts = await this.soulAddr.getAllSBTs();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSoulStore, import.meta.hot));
}
