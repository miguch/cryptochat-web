<template>
<div id="chat-user-search-area">
    <b-input-group prepend="Username/Address">
        <b-form-input v-model="query"></b-form-input>
        <b-input-group-append>
        <b-btn variant="info" @click="runSearch">Search</b-btn>
        </b-input-group-append>
    </b-input-group>
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import blockchainUtils from '../blockchain';
import chatter from '../chat'

export default Vue.extend({
    data: function() {
        return {
            query: ""
        };
    },
    
    methods: {
        runSearch() {
            this.$emit('onSearch', this.query);
        }

    }
});
</script>

<style>
#chat-user-search-area {
    margin: 10px;
}
</style>
