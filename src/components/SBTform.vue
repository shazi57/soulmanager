<script setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '../store/appStore';

const {
  selectedSoul, ipfsCID, openModal, option, recipientSoulAddr, issuerSoulAddr,
} = storeToRefs(useAppStore());

const store = useAppStore();

const {
  issueSBTtoSelf, issuePendingSBT, claimSBT,
} = store;

</script>

<template>
  <PDialog
    v-model:visible="openModal"
    :header="store.formTitle"
    :breakpoints="{'960px': '75vw', '640px': '90vw'}"
    :style="{width: '30vw'}"
    :modal="true"
  >
    <div
      class="p-inputgroup"
    >
      <PDropdown
        v-model="selectedSoul"
        option-label="name"
        option-value="code"
        :options="store.soulOptions"
        :placeholder="store.dropDownPH"
      />
    </div>
    <div
      v-if="option === 'other'"
    >
      <div class="p-inputgroup">
        <span class="p-float-label">
          <PInputText
            v-model="recipientSoulAddr"
          />
          <label for="inputtext">Recipient Soul Address</label>
        </span>
      </div>
    </div>
    <div
      v-if="option === 'claim'"
    >
      <div class="p-inputgroup">
        <span class="p-float-label">
          <PInputText
            v-model="issuerSoulAddr"
          />
          <label for="inputtext">Issuer's Soul Address</label>
        </span>
      </div>
    </div>
    <div class="p-inputgroup">
      <span class="p-float-label">
        <PInputText
          v-model="ipfsCID"
        />
        <label for="inputtext">Enter IPFS CID</label>
      </span>
    </div>
    <template #footer>
      <PButton
        v-if="option === 'other'"
        label="Confirm"
        icon="pi pi-check"
        autofocus
        @click="issuePendingSBT"
      />
      <PButton
        v-if="option === 'self'"
        label="Confirm"
        icon="pi pi-check"
        autofocus
        @click="issueSBTtoSelf"
      />
      <PButton
        v-if="option === 'claim'"
        label="Confirm"
        icon="pi pi-check"
        autofocus
        @click="claimSBT"
      />
    </template>
  </PDialog>
</template>

<style scoped>

.p-float-label {
  margin-top: 4vh;
}
</style>
