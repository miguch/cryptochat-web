<template>
<div id="chat-navbar">
<b-navbar toggleable="md" type="dark" id="chat-title-bar" sticky>

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand href="#">CryptoChat</b-navbar-brand>

  <b-navbar-nav class="ml-auto">
    <b-nav-item href="#" disabled>{{ address }}</b-nav-item>
  </b-navbar-nav>

</b-navbar>

<b-breadcrumb :items="items" id="chat-breadcrumb" />
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import chatter from "../chat";

export default Vue.extend({
    data: function() {
        return {
            currentPage: 'Contacts',
            items: [
                {
                    text: 'Contacts',
                    href: '/'
                }
            ]
        };
    },

    computed: {
        address: function() {
            return chatter.selfAddress;
        }
    }
    
});
</script>

<style>
#chat-navbar {
    text-align: center;
}

#chat-title-bar {
    margin-bottom: 10px;
    background-color: #563d7c;
}

#chat-breadcrumb {
    width: 85%;
    margin: 0 auto;
    background-color: #ffffff;
}

</style>
