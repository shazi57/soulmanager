<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  useBoard,
  useEthers,
  useEthersHooks,
  useWallet,
} from 'vue-dapp';
import PMessage from 'primevue/toast';
import SBTForm from './components/SBTform.vue';
import CreateSoulButton from './components/CreateSoulButton.vue';
import { useAppStore } from './store/appStore';

const {
  address, isActivated, activate, signer,
} = useEthers();

const router = useRouter();
const { onAccountsChanged } = useWallet();
const { connectWith } = useWallet();
const { onActivated, onDeactivated } = useEthersHooks();
const { open } = useBoard();
const store = useAppStore();
const { isLoading } = storeToRefs(useAppStore());
const { initSoulManager, removeAllListeners } = store;
// wallet modal
const infuraId = '';

const connectors = [
  new MetaMaskConnector({
    appUrl: 'http://localhost:3000',
  }),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
      4: `https://rinkeby.infura.io/v3/${infuraId}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: 'Vue Dapp',
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
];

onActivated(() => {
  initSoulManager(signer);
  router.push('/souls/');
  if (window.ethereum == null) {
    throw new Error('No injected Ethereum provider');
  }
  localStorage.setItem('isActivated', isActivated.value);
});

onAccountsChanged(() => {
  initSoulManager(signer);
});

onDeactivated(() => {
  router.push('/');
  localStorage.setItem('isActivated', isActivated.value);
});

onMounted(async () => {
  if (localStorage.getItem('isActivated')) {
    const provider = await connectors[0].getProvider();
    await activate(provider);
    await connectWith(connectors[0]);
  }
});

onUnmounted(async () => {
  await removeAllListeners();
});

</script>
<template>
  <SBTForm />
  <PMessage />
  <div id="header">
    <router-link
      id="title-link"
      to="/"
    >
      <PButton
        id="title"
        class="p-button-text"
      >
        SoulManager
      </PButton>
    </router-link>
    <div id="button-wrapper">
      <PProgressSpinner
        v-if="isLoading"
        id="spinner"
        strokeWidth="5"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      />
      <CreateSoulButton />
      <div
        id="wallet-button"
      >
        <PButton
          :disabled="isActivated"
          @click="open"
        >
          {{
            !isActivated ? "Connect" : `address: ${address.substring(0, 8)}...`
          }}
        </PButton>
      </div>
      <vd-board :connectors="connectors" />
    </div>
  </div>
  <router-view />
</template>

<style>

#spinner {
  margin-right: -1vw;
  width: 3vw;
  height: 3vh;
}
body {
  background-color: var(--surface-ground);
  height: 100%;
  margin: 0px;
}

#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  width: 100%;
}

#header {
  display:flex;
  justify-content: space-between;
  width: 90%;
  margin: auto;
}

#logo-title {
  width: 25%;
  height: 100%;
}

#title-link {
  display: flex;
  text-decoration: none;
}

#title {
  color: var(--text-color);
  display: block;
  font-size: 2em;
  text-decoration: none;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  margin-left: 0;
  margin-right: 0;
  font-weight: bold;
}

#button-wrapper {
  display: flex;
  align-items: center;
  gap: 1vw;
}
#input-soul-name {
  width: 15vw;
  display: flex;
  justify-content: space-between;
  gap: 2vh;
  flex-direction: column;
}
</style>
