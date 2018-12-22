import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App.vue';
import cryptoUtils from "./rsa_crypto";
import "blockies";


import blockchain = require("./blockchain");

window.addEventListener('load', function() {
    window.contract = blockchain.getContract();
});

Vue.use(BootstrapVue);

new Vue({
    render: (h) => h(App),
  }).$mount('#app');
  
