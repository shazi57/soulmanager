<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  useBoard,
  useEthers,
  useEthersHooks,
  useWallet,
} from 'vue-dapp';
import { useAppStore } from '../store/appStore';

const {
  address, isActivated, activate, signer,
} = useEthers();

const router = useRouter();
const { onAccountsChanged } = useWallet();
const { connectWith } = useWallet();
const { onActivated, onDeactivated } = useEthersHooks();
const { open } = useBoard();
const { setSoulManager } = useAppStore();

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

onActivated(async () => {
  setSoulManager(signer);

  localStorage.setItem('isActivated', isActivated.value);

  router.push('/souls');
});

onAccountsChanged(async () => {
  setSoulManager(signer);
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

</script>

<template>
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
      <div
        v-if="isActivated"
        id="plus-button"
      >
        <PButton
          class="p-button-text"
          @click="createNewSoul()"
        >
          <i class="pi pi-plus" />
          Create New Soul
        </PButton>
      </div>
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
</template>

<style scoped>
.pi-plus {
  margin-right: 1vh;
  font-size: 2vh;
}

.p-button-text {
  font-size: 2vh;
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
}
</style>
