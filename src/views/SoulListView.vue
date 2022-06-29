<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import SoulCard from '../components/SoulCard.vue';
import SbtList from '../components/SbtList.vue';
import { useAppStore } from '../store/appStore';
import { useSoulStore } from '../store/soulStore';

// const appStore = useAppStore();
const router = useRouter();
const soulStore = useSoulStore();
const { souls, tokenAlarm } = storeToRefs(useAppStore());
const { setLoadingFalse, setTokenAlarmFalse } = useAppStore();
const toast = useToast();
const soulAddr = ref('');

onBeforeRouteUpdate((to) => {
  if (to.query.address) {
    const { initSoul } = useSoulStore();
    const { address } = to.query;
    initSoul(address);
    soulAddr.value = address;
  }
});

watch(souls, async (newSouls, oldSouls) => {
  if (oldSouls && newSouls.length - oldSouls.length === 1) {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Soul Deployed Successfully',
      life: 3000,
    });
    setLoadingFalse();
  }
});

watch(tokenAlarm, async (shouldAlarm) => {
  if (shouldAlarm) {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Token Minted Successfully',
      life: 3000,
    });
    setTokenAlarmFalse();
    setLoadingFalse();
  }
});

function onButtonClicked({ option }) {
  if (option === 'opensea') {
    window.open(`https://testnets.opensea.io/${soulAddr.value}`);
  } else {
    window.open(`https://rinkeby.etherscan.io/address/${soulAddr.value}`);
  }
}
</script>

<template>
  <PDivider id="top-divider" />
  <div id="sv-container">
    <div id="soul-list">
      <SoulCard :souls="souls" />
    </div>
    <PDivider
      id="ver-divider"
      layout="vertical"
    />
    <div id="list-wrapper">
      <div
        v-if="soulAddr"
        class="soul-info-wrapper"
      >
        <h5
          id="address-h4"
        >
          Soul @ {{ soulAddr }}
        </h5>
        <div
          id="opensea-button-wrapper"
          class="logo-button-wrapper"
        >
          <PButton
            class="logo-button p-button-text p-button-rounded"
            @click="() => { onButtonClicked({ option: 'opensea' })}"
          >
            <img
              alt="logo"
              class="logo-button-img"
              src="../assets/Logomark-Blue.png"
            >
          </PButton>
        </div>
        <div class="logo-button-wrapper">
          <PButton
            class="logo-button p-button-text p-button-rounded"
            @click="() => { onButtonClicked({ option: 'etherscan' })}"
          >
            <img
              alt="logo"
              class="logo-button-img"
              src="../assets/etherscan-logo-circle.png"
            >
          </PButton>
        </div>
      </div>
      <SbtList
        :soul-addr="soulAddr"
        :sbts="soulStore.selfIssuedSBTs"
        title="Self-certified SBTs"
      />
      <SbtList
        :soul-addr="soulAddr"
        :sbts="soulStore.otherIssuedSBTs"
        title="SBTs issued by others"
      />
    </div>
  </div>
</template>

<style scoped>
#opensea-button-wrapper {
  margin-left: 0.2vw;
}
#address-h4 {
  margin: 0;
  font-size: 2vh;
}

.soul-info-wrapper {
  margin-top: 2vh;
  display: flex;
  float: right;
  margin-right: 5vw;
  color: var(--text-color-secondary);
}
.logo-button-wrapper {
  margin-left: 0.1vh;
  margin-bottom : 0.2vh;
}
.logo-button {
  padding: 0;
}

.logo-button-img{
  width: 1vw;
}

#list-wrapper {
  width: 100%;
}
#soul-list {
  padding-top: 2vh;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  /* align-items: center; */
}

#top-divider {
  margin: 0px;
}

#sv-container {
  display: flex;
  width: 100%;
  height: 100%;
}

#soul-list {
  width: 15vw;
  min-height: 90vh;
}

#ver-divider {
  margin: 0;
}
</style>
