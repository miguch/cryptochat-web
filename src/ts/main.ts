import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import VueRouter from 'vue-router';
import App from './App.vue';

import blockchain from "./blockchain";

window.addEventListener('load', function() {
    window.contract = blockchain.Contract;
});

Vue.use(VueRouter);
Vue.use(BootstrapVue);

new Vue({
    render: (h) => h(App),
  }).$mount('#app');
  
