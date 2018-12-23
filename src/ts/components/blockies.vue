<template>
<div class="chat-blockies">
    <div ref='blockiesCanvasContainer'></div>
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import blockies from 'blockies';

export default Vue.extend({
    data() {
        return {
            
        };
    },

    props: [
        "userAddress"
    ],
    mounted() {
        let icon = blockies({
            seed: this.userAddress,
            size: 15,
            scale: 3,
            color: '#dfe',
            bgcolor: '#aaa',
            spotcolor: '#000'
        });
        (<Element>this.$refs.blockiesCanvasContainer).appendChild(icon);
    }
    
});
</script>

<style>
.chat-blockies {
    height: 45px;
    width: 45px;
    margin: auto;
}
</style>
