<template>
<div id="chat-welcome">

<p v-if="!showAlert"> Your Ethereum Address is: </p>
<div id="chat-welcome-address" v-if="!showAlert">
<p><strong>{{ address }}</strong></p>
<hr/>
</div>
<b-alert :show="showAlert" @dismissed="showAlert=false;" :dismissible="alertDismissable" :variant="alertType" class="chat-welcome-alert">
    {{ alertMessage }}
</b-alert>
<div id="chat-welcome-login" v-if="registered">
    <p><strong>Welcome, {{username}} </strong></p>
    <p>Please enter your password below:</p>
    <b-form @submit.prevent="onLogin">
        <b-form-group>
        <b-form-input id="chat-login-pass"
                        type="password"
                        v-model="passphrase"
                        required
                        placeholder="Passphrase">
        </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
    <br>
</div>
<div id="chat-welcome-register" v-if="newComer">
    <p><strong>Welcome to CryptoChat</strong></p>
    <p>Please sign up below</p>
    <b-form @submit.prevent="onSignUp">
        <b-form-input id="chat-signup-username"
                        type="text"
                        v-model="regUsername"
                        required
                        placeholder="Username">
        </b-form-input>                
        <b-form-group description="Please keep your password somewhere safe, there is no way to get your data back if you lose it.">
        <b-form-input id="chat-signup-pass"
                        type="text"
                        v-model="regPassphrase"
                        required
                        placeholder="Passphrase">
        </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Sign Up</b-button>
    </b-form>
    <br>
</div>
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import blockChainUtils from '../blockchain';
import chatter from "../chat";

export default Vue.extend({
    data() {
        return {
            registered: false,
            newComer: false,
            username: "",
            regUsername: "",
            regPassphrase: "",
            passphrase: '',
            showAlert: false,
            alertDismissable: false,
            alertMessage: ""
        }
    },
    mounted() {
        this.checker();
    },
    watch: {
        newAddress(newVal, oldVal) {
            if (newVal.length !== 0) {
                this.refresh();
            }
        }
    },
    computed: {
        address() {
            return chatter.selfAddress;
        },
        alertType(): string {
            return this.alertDismissable ? 'danger' : 'info';
        }
    },
    props: [
        "newAddress"
    ],
    methods: {
        refresh() {
            this.registered = false;
            this.newComer = false;
            this.checker();
        },
        checker: function() {
            //Must wait till contract is ready
            if (blockChainUtils.Contract) {
                this.setRegistered();
            } else {
                setTimeout(this.checker, 1000);
            }
        },
        setRegistered: async function() {
            let [username, status] = await chatter.searchAddress(chatter.selfAddress);
            if (status) {
                this.username = username;
            }
            this.registered = status;
            this.newComer = !status;
        },
        runLogin: async function() {
            let loginStatus = await chatter.attemptLogin(this.passphrase);
            if (loginStatus) {
                this.showAlert = false;
                this.$router.push({name: 'contacts'});
            } else {
                this.alertMessage = "Fail to login";
                this.alertDismissable = true;
            }
        },
        onLogin: function() {
            this.showAlert = true;
            this.alertMessage = 'Logging you in... This should usually takes about 10 seconds. You may experience browser stall.';
            //Display message before a computational task
            setTimeout(this.runLogin, 200);
        },
        runSignUp: async function() {
            let [errMsg, status] = await chatter.createNewUser(this.regPassphrase, this.regUsername);
            if (status) {
                this.showAlert = false;
                this.$router.push({name: 'contacts'});
            } else {
                this.alertMessage = "Fail to Signup: " + errMsg;
                this.alertDismissable = true;
            }
        },
        onSignUp: async function() {
            this.showAlert = true;
            this.alertMessage = 'Signing you up... This should usually takes about 10 seconds. You may experience browser stall.';
            setTimeout(this.runSignUp, 200);
        }
    }
    
});
</script>

<style>
#chat-welcome {
    height: 400px;
    vertical-align: middle;
    width: 380px;
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

#chat-welcome-address, #chat-welcome-login, #chat-welcome-register {
    width: 80%;
    word-break: break-all; 
    margin: auto;
}

.chat-welcome-alert {
    word-break: normal;
}

</style>
