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
        });
        (<Element>this.$refs.blockiesCanvasContainer).appendChild(icon);
    }
    
});
</script>

<style>
.chat-blockies {
    height: 45px;
    width: 45px;
    margin: 0 3px 0px 3px;
    float: left;
}
</style>
