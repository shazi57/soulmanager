import { defineStore, acceptHMRUpdate } from 'pinia';
import { markRaw } from 'vue';
import axios from 'axios';
// import { useToast } from 'primevue/usetoast';

import { ethers } from 'ethers';
import { useAppStore } from './appStore';

import { abi } from '../artifacts/contracts/Soul.sol/Soul.json';

export const useSoulStore = defineStore('Soul', {
  state: () => ({
    soulContract: null,
    sbts: [],
  }),
  getters: {
    selfIssuedSBTs:
      (state) => state.sbts.filter((sbt) => sbt.issuer === state.soulContract.address),
    otherIssuedSBTs:
      (state) => state.sbts.filter((sbt) => sbt.issuer !== state.soulContract.address),
  },
  actions: {
    async fetchSBTs() {
      const numSBTs = await this.soulContract.size();
      const newSbts = [];
      for (let i = 0; i < numSBTs; i += 1) {
        const tokenURI = await this.soulContract.getTokenURI(i);
        const { data } = await axios.get(tokenURI);
        const issuer = await this.soulContract.getIssuer(i);
        newSbts.push({
          issuer,
          tokenId: i,
          data,
        });
      }
      this.sbts = newSbts;
    },
    async initSoul(address) {
      const appStore = useAppStore();
      const { signer } = appStore.soulManager;
      this.soulContract = markRaw(new ethers.Contract(address, abi, signer));
      await this.fetchSBTs();
      this.soulContract.on('TokenReceived', async () => {
        appStore.tokenAlarm = true;
        await this.fetchSBTs();
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSoulStore, import.meta.hot));
}
