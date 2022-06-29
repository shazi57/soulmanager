<script  setup>
import SBTCard from './SBTCard.vue';

const props = defineProps({
  soulAddr: String,
  sbts: Object,
  title: String,
});

</script>

<template>
  <div
    id="sbt-list"
  >
    <div
      class="header-wrapper"
    >
      <div
        v-if="props.sbts.length > 0"
        id="text-wrapper"
      >
        <h2>{{ props.title }}</h2>
      </div>
    </div>
    <div
      id="card-container"
    >
      <SBTCard
        v-for="sbt in props.sbts"
        :key="sbt.tokenId"
        class="si-sbts-container"
        :token-id="sbt.tokenId"
        :issuer="sbt.issuer"
        :name="sbt.data.name"
        :image="sbt.data.image"
        :description="sbt.data.description"
      />
    </div>
  </div>
</template>

<style scoped>
.header-wrapper{
  justify-content: space-between;
  display: flex;
}
#card-container {
  gap: 2vw;
  display: flex;
}
.si-sbts-container {
  width: 15vw;
}
#sbt-list {
  width: 100%;
  margin-left: 2vw;
}

h2 {
  color: var(--text-color);
}
</style>
