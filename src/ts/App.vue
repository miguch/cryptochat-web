<template>
  <div id="app">
    <NavBar v-on:addressChange="setNewAddress"></NavBar>
    <router-view :newAddress="newAddress"/>
  </div>
</template>

<script lang="ts">
import VueRouter from 'vue-router';
import { Component, Vue } from 'vue-property-decorator';
import NavBar from './components/NavBar.vue';

// @ts-ignore
@Component({
  components: {
    NavBar
  },
})
export default class App extends Vue {
  newAddress = '';
  setNewAddress(event: string) {
    this.newAddress = event;
  }
  created() {
    this.$router.push({name: 'welcome'});
  }

}
</script>

<style>
#app {
  background-color: #272b30;
  text-align: center;
  margin: 0;
  color: #c8c8c8;
  height: 100%;
}
body, html {
  height: 100%;
}
</style>
