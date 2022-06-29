<script setup>
import { useEthers } from 'vue-dapp';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../store/appStore';

const { isActivated } = useEthers();
const { createNewSoul, displayModal } = useAppStore();

const op = ref();
const store = useAppStore();
// const { openModal } = storeToRefs({ useAppStore });

const toggle = (event) => {
  op.value.toggle(event);
};

const items = ref([
  {
    label: 'Issue SBT',
    icon: 'pi pi-plus',
    items: [
      {
        label: 'To my Soul',
        command: async () => {
          displayModal({ option: 'self' });
        },
      },
      {
        label: "To other's Soul",
        command: async () => {
          displayModal({ option: 'other' });
        },
      },
    ],
  },
  {
    label: 'Claim SBT',
    icon: 'pi pi-check',
    command: async () => {
      displayModal({ option: 'claim' });
    },
  },
  {
    label: 'Upload IPFS',
    icon: 'pi pi-upload',
  },
]);
</script>

<template>
  <div
    v-if="isActivated"
    id="plus-button"
  >
    <PSplitButton
      icon="pi pi-plus"
      :model="items"
      label="Create New Soul"
      @click="toggle"
    />
    <POverlayPanel
      ref="op"
      :show-close-icon="true"
    >
      <div id="input-soul-name">
        <label for="soulName">
          Name of Soul
        </label>
        <PInputText
          id="soulName"
          v-model="store.soulName"
          type="text"
        />
        <label for="soulTicker">
          Soul Ticker (3 max character)
        </label>
        <PInputText
          id="soulTicker"
          v-model="store.soulTicker"
          type="text"
        />
        <div id="create-button-wrapper">
          <PButton @click="createNewSoul">
            Create
          </PButton>
        </div>
      </div>
    </POverlayPanel>
  </div>
</template>

<style>

.pi-plus {
  margin-right: 1vh;
  font-size: 2vh;
}

.p-button-text {
  font-size: 2vh;
}
</style>
