<template>
  <div id="app">
    <NavBar></NavBar>
  </div>
</template>

<script lang="ts">
import VueRouter from 'vue-router';
import { Component, Vue } from 'vue-property-decorator';
import NavBar from './components/NavBar.vue';

@Component({
  components: {
    NavBar
  },
})
export default class App extends Vue {
  
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
