<script setup>
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import SoulCard from '../components/SoulCard.vue';
import { useAppStore } from '../store/appStore';
import { useSoulStore } from '../store/soulStore';

// const appStore = useAppStore();
const { souls } = storeToRefs(useAppStore());
const toast = useToast();

onBeforeRouteUpdate((to, from) => {
  // console.log('route upated');
  // console.log(to);
  if (to.query.address) {
    const { fetchSBTs } = useSoulStore();
    const { address } = to.query;
    fetchSBTs(address);
  }
});

watch(souls, async (newSouls, oldSouls) => {
  // console.log(newSouls, oldSouls);
  if (oldSouls && newSouls.length - oldSouls.length === 1) {
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Contract Deployed Successfully',
      life: 3000,
    });
  }
});

// appStore.$subscribe((mutation, state) => {
//   console.log(mutation);

// });

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
    <div id="sbt-list" />
  </div>
</template>

<style scoped>

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
  margin-top: 0;
  width: 15vw;
  min-height: 90vh;
}

#ver-divider {
  margin: 0;
}
</style>
