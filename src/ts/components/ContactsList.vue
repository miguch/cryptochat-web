<template>
<div id="chat-contacts-list">
    <Blockies user-address="selfAddress"/>
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import chatter from "../chat";
import Blockies from './blockies.vue';

export default Vue.extend({
    components: {
        Blockies
    },
    data() {
        return {
            selfAddress: chatter.selfAddress,
        };
    }

    
});
</script>

<style>
#chat-contacts-list {
    height: 70%;
    vertical-align: middle;
    width: 75%;
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0 4px 10px #999;
    border-radius: 10px;
    overflow: auto;
    margin: auto;
    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
    color: #000;
}
</style>
