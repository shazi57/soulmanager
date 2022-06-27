<script setup>
// import Header from '../components/Header.vue';
// import { useBoard } from 'vue-dapp';
// const { open } = useBoard();
</script>

<template>
  <!-- <Header /> -->
  <div id="intro-container">
    <img
      id="logo"
      src="../assets/surfaceBackground.png"
    >
    <h3>
      &emsp;Create your Soul wallet that can hold Soulbound tokens(SBT),
      non-transferrable NFTs that you can share with other people as Verifiable Credentials!
    </h3>

    <h3>With SoulManager you can:</h3>
    <ol>
      <li>
        Issue SBTs to your own Soul(self-cerified credentials)
        or to other Souls which then can be attested by the issuer
      </li>
      <li>
        Create and manage multiple souls categorized by their properties
      </li>
      <li>
        Approve or disapprove verifiers to access your SBTs
        because we care so much about your privacy!
      </li>
    </ol>

    <h2>Connect your wallet to start now!</h2>
  </div>
</template>

<style>
#intro-container {
  margin: auto;
  /* margin-top: 20vh; */
  width: 50%;
  text-align: left;
}
#logo {
  width: 40%;
  height: 40%;
  margin-left: 13vw;
}
li {
  margin-top: 1.5vh;
}
</style>
