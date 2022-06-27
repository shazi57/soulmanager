<script setup>
const props = defineProps({
  souls: Object,
});
</script>

<template>
  <router-link
    v-for="soul in props.souls"
    :key="soul.soulAddress"
    v-slot="{ navigate }"
    :to="`/souls?address=${soul.soulAddress}`"
    custom
  >
    <PButton
      class="card-button p-button-text"
      @click="navigate"
    >
      <PCard>
        <template #title>
          {{ soul.soulName }}
        </template>
        <template #subtitle>
          {{ soul.soulTicker }}
        </template>
        <template #content>
          {{ soul.soulAddress }}
        </template>
      </PCard>
    </PButton>
  </router-link>
</template>

<style>
.card-button{
  color: white;
}

.p-card-body {
  text-align: left;
}

.p-card-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.p-card {
  width: 100%;
}
</style>
