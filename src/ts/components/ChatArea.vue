<template>
<div id="chat-area">
    <p id="chat-area-header"> {{ targetUsername }} </p>
    <hr />
    <div id="chat-message-area">
        <div v-for="msg of messages" v-bind:key="msg.sendDate" class="chat-messages-item">
            <!-- Send from user, display on the right -->
            <div v-if="isSender(msg)" class="chat-sent-msg">
                <Blockies :user-address="selfAddress" class="self-avatar"/>
                <div class="chat-msg-window chat-sent-msg-window" >
                    <p><strong>{{ msg.content }}</strong></p>
                    <span> {{ getDateString(msg.sendDate) }} </span>
                </div>
                
            </div>
            <!-- Send from target, display on the left -->
            <div v-else class="chat-recv-msg"> 
                <Blockies :user-address="msg.sender" />
                <div class="chat-msg-window chat-recv-msg-window" >
                    <p><strong>{{ msg.content }}</strong></p>
                    <span> {{ getDateString(msg.sendDate) }} </span>
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div id="chat-message-input-area">
        <b-form @submit.prevent="sendMessage">
        <b-form-textarea no-resize required rows="3" max-rows="3" v-model="inputMessage">
        </b-form-textarea>
        <b-form-input type="text" id="chat-red-packet-input" v-model.number="transactionNum" placeholder="Red Packet Ethers" />
        <b-btn variant="danger" @click="sendRedPacket" >
            Send Red Packet
        </b-btn>
        <b-btn type="submit" id="chat-send-msg-btn" variant="success">
            Send
        </b-btn>
        </b-form>
    </div>
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import chatter from "../chat";
import Blockies from "./blockies.vue";

interface MessageData {
    content: string;
    sender: string;
    receiver: string;
    sendDate: number;
}

export default Vue.extend({
    components: {
        Blockies
    },

    data(): {
        messages: Array<MessageData>;
        selfAddress: string;
        targetUsername: string;
        inputMessage: string;
        transactionNum: number;
    } {
        return {
            messages: [],
            selfAddress: '',
            targetUsername: '',
            inputMessage: '',
            transactionNum: 0
        };
    },

    mounted() {
        this.selfAddress = chatter.selfAddress;
        this.setUsername();
        this.updateMessages();
        //Periodically update messages
        setInterval(this.updateMessages, 5000);
    },

    methods: {
        updateMessages() {
            let target = this.$route.params.target;
            this.messages = chatter.getMessagesWithUser(target);
        },
        async setUsername() {
            let [name, status] = await chatter.searchAddress(this.$route.params.target);
            if (status) {
                this.targetUsername = name;
            }
        },
        isSender(msg: MessageData) {
            return msg.sender === chatter.selfAddress;
        },
        getDateString(date: number) {
            let obj = new Date(date);
            return obj.toLocaleString();
        },
        async sendMessage() {
            await chatter.sendMessage(this.$route.params.target, this.inputMessage);
            this.messages.push({
                content: this.inputMessage + "(" + "pending" + ")",
                sender: this.selfAddress,
                receiver: this.$route.params.target,
                sendDate: Date.now()
            });
            this.inputMessage = '';
        },
        async sendRedPacket() {
            if (this.transactionNum <= 0) {
                return;
            }
            await chatter.sendTransaction(this.$route.params.target, this.transactionNum);
        }
    }
    
});
</script>

<style>
#chat-area {
    height: 75%;
    vertical-align: middle;
    width: 75%;
    position: absolute;
    background-color: #efeff4;
    box-shadow: 0 4px 10px #999;
    border-radius: 10px;
    margin: auto;
    overflow: hidden;
    top: 100px;
    bottom: 0;
    left: 0;
    right: 0;
    color: #000;
}
#chat-area hr {
    margin: 0;
}
#chat-area-header {
    background: #494b4d;
    color: #eeeeee;
    vertical-align: middle;
    font-size: 23px;
    margin-bottom: 0;
}
#chat-message-area {
    height: 70%;
    overflow: auto;
}
.self-avatar {
    float: right;
}
.chat-messages-item {
    margin: 10px;
    display: block;
}
.chat-msg-window span {
    font-size: 12px;
    margin-left: 5px;
}
.chat-msg-window p {
    margin-bottom: 0;
    margin-left: 5px;
}
.chat-sent-msg {
    text-align: left;
}
.chat-recv-msg {
    text-align: left;
}
.chat-recv-msg-window {
    background-color: #ADD8E6;
    margin-left: 64px;
}
.chat-sent-msg-window {
    background-color: #86f042;
    margin-left: auto;
    margin-right: 64px;
}

.chat-msg-window {
	position: relative;
	border-radius: .4em;
    width: 36%
}

.chat-sent-msg-window:after {
    content: '';
	position: absolute;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-right: 0;
    border-left-color: #86f042;
    border-bottom: 0;
    top: 12px;
    right: 0;
    margin-right: -15px;
}

.chat-recv-msg-window:after {
    content: '';
	position: absolute;
	width: 0;
	height: 0;
	border: 20px solid transparent;
	border-left: 0;
    border-right-color: #ADD8E6;
    border-bottom: 0;
    top: 12px;
    left: 0;
    margin-left: -15px;
}
#chat-message-input-area {
    text-align: right;
    overflow: auto;
}
#chat-send-msg-btn {
    margin-right: 60px;
}
#chat-red-packet-input {
    width: 40%;
    display: inline-block;
}

</style>
