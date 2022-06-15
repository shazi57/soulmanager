<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { MetaMaskConnector, WalletConnectConnector, CoinbaseWalletConnector, useBoard, useWallet, useEthers, useEthersHooks} from 'vue-dapp';

const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } = useWallet();
const { address, balance, chainId, isActivated } = useEthers();
const { onActivated, onChanged } = useEthersHooks();

const infuraId = '';
const { open } = useBoard();
const connectors = [
  new MetaMaskConnector({
    appUrl: "http://localhost:3000"
  }),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
      4: `https://rinkeby.infura.io/v3/${infuraId}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: "Vue Dapp",
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
];

onAccountsChanged(() => {
  console.log('accounts changed');
});

onActivated(() => {
  console.log('account activated');
  console.log({address, chainId, isActivated, balance});
})

</script>

<template>
  <div id="header" >
    <router-link to="/" id="title-link">
      <!-- <img src="./assets/logo.png" id="logo-title"/> -->
      <Button class="p-button-text" id="title">
        SoulManager
      </Button>
    </router-link>
    <div id="button-wrapper">
      <Button @click="open">Connect Wallet</button>
      <vd-board :connectors="connectors" dark />
    </div>
  </div>
  <router-view></router-view>
</template> 

<style>
body {
  background-color: var(--surface-ground);
}
#header {
  display:flex;
  justify-content: space-between;
  width: 100%;
}
#app {
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: auto;
  width: 90%;
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
  margin-top: 4vh;
}

</style>
