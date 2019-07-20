<template>
<div id="chat-navbar">
<b-navbar toggleable="md" type="dark" id="chat-title-bar" sticky>

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand href="#">CryptoChat</b-navbar-brand>

  <b-btn variant="success" v-b-modal.chat-contract-config @click="initAddress">
      Change Contract Address
  </b-btn>

  <b-modal id="chat-contract-config" ref="contractConfig" hide-footer title="Contract Configuration">
      <p> Current Contract Address is: </p>
      <p><strong>{{ contractAddress }}</strong></p>
      <hr/>
      <p>Enter the new contract address below:</p>
      <b-input type="text" v-model="newAddress" placeholder="New Address" />
      <br />
      <b-alert :show="dismissCountDown"
             dismissible
             variant="warning"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged">
      <p>Not a valid contract address!</p>
      <b-progress variant="warning"
                  :max="dismissSecs"
                  :value="dismissCountDown"
                  height="4px">
      </b-progress>
    </b-alert>  
    <br/>
    <b-btn variant="primary" @click="changeContractAddress">OK</b-btn>
  </b-modal>

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
import blockchainUtils from '../blockchain';

export default Vue.extend({
    data: function() {
        return {
            newAddress: '',
            dismissSecs: 10,
            dismissCountDown: 0,
            showDismissibleAlert: false,
            contractAddress: '',
            username: ''
        };
    },

    computed: {
        address: function() {
            if (this.username.length === 0) {
                return chatter.selfAddress;
            } else {
                return (this as any).username + ": " + chatter.selfAddress;
            }
        },
        items: function() {
            let is;
            if (this.$route.name === 'chatArea') {
                let name;
                is = [
                    {
                        text: 'Contacts',
                        to: {name: 'contacts'}
                    },
                    {
                        text: this.$route.params.target,
                        href: this.$route.fullPath
                    }
                ];
            } else {
                is = [
                    {
                        text: this.$route.name,
                        href: this.$route.path
                    }
                ];
            }
            return is;
        },
    },

    mounted() {
        this.setUsername();
    },

    methods: {
        async setUsername() {
            if (!blockchainUtils.Contract) {
                setTimeout(this.setUsername, 200);
            } else {
                let [username, status] = await chatter.searchAddress(chatter.selfAddress);
                if (status) {
                    this.username = username;
                }
            }
        },
        initAddress() {
            this.contractAddress = blockchainUtils.contractAddress;
        },
        hideModal(modal: any) {
            modal.hide()
        },
        changeContractAddress() {
            if (blockchainUtils.checkValidAddress(this.newAddress)) {
                blockchainUtils.setNewContractAddress(this.newAddress);
                this.$emit("addressChange", this.newAddress);
                this.hideModal(this.$refs.contractConfig);
                this.contractAddress = this.newAddress;
                this.$router.push({name: 'welcome'});
            } else {
                this.showAlert();
            }
        },
        countDownChanged (dismissCountDown: number) {
            this.dismissCountDown = dismissCountDown;
        },
        showAlert () {
            this.dismissCountDown = this.dismissSecs;
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
}

strong {
    word-break: break-all;
}

#chat-contract-config {
    color: #000;
}

</style>
