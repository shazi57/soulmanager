<script setup>
const props = defineProps({
  tokenId: Number,
  description: String,
  name: String,
  issuer: String,
  image: String,
});
</script>

<template>
  <PCard>
    <template #header>
      <div class="sbt-image-container">
        <PBadge
          class="card-badge"
          :value="props.tokenId.toString()"
        />
        <img
          v-if="props.image"
          class="card-image"
          :src="props.image"
        >
        <img
          v-else
          class="card-image"
          src="https://ipfs.io/ipfs/QmeuZRYMdKsyBQPsZhbQDBDu5okZQuQrjwpoE3NoeZRkhU"
        >
      </div>
    </template>
    <template #title>
      {{ props.name }}
    </template>
    <template #subtitle>
      issued from {{ props.issuer.substring(0, 14) }}...
    </template>
    <template #content>
      {{ props.description || '-' }}
    </template>
  </PCard>
</template>

<style>
.card-image {
  z-index: -1;
}

.card-badge {
  position: relative;
  top: 1vh;
  left: 1vh;
}
.p-card-footer {
  margin-bottom: 2vh;
  float: right;
}
.sbt-image-container {
  overflow: hidden;
  height: 20vh;
}
</style>
