<template>
<div id="chat-contacts-list">
    <Searcher v-on:onSearch="searchUser"/>
    <hr />
    <b-list-group id="chat-contacts-list-group">
        <b-list-group-item v-for="user of userList" v-bind:key="user.address">
            <Blockies :user-address="user.address" v-if="user.address !== '0x0'"/>
            <div>
            <p><strong>{{user.username}}</strong></p>
            <span v-if="user.address !== '0x0'">{{user.address}}</span>
            </div>
        </b-list-group-item>
    </b-list-group>
</div>
</template>

<script lang='ts'>
import Vue from 'vue';
import chatter from "../chat";
import Blockies from './blockies.vue';
import Searcher from './UserSearcher.vue';
import blockchainUtils from '../blockchain';

interface UserInfo {
    username: string;
    address: string;
}

export default Vue.extend({
    components: {
        Blockies,
        Searcher
    },
    data(): {
        selfAddress: string,
        chattedUsers: Array<UserInfo>,
        searchedUsers: Array<UserInfo>,
        searchMode: boolean
    } {
        return {
            selfAddress: chatter.selfAddress,
            chattedUsers: [],
            searchedUsers: [],
            searchMode: false
        };
    },

    computed: {
        userList(): Array<UserInfo> {
            if (this.searchMode) {
                return this.searchedUsers;
            } else {
                return this.chattedUsers;
            }
        }
    },

    mounted() {
        this.chattedUsers = chatter.userInfos;
        setInterval(this.updateChattedUsers, 3000);
    },

    methods: {
        updateChattedUsers() {
            this.chattedUsers = chatter.userInfos;
        },
        runSearch(query: string) {
            this.searchUser(query);
        },
        async searchUser(query: string) {
            if (query.length === 0) {
                this.searchMode = false;
            } else {
                this.searchMode = true;
                this.searchedUsers = [];
                if (blockchainUtils.checkValidAddress(query)) {
                    //Search address
                    let [name, status] = await chatter.searchAddress(query);
                    if (status) {
                        this.searchedUsers.push({
                            username: name,
                            address: query
                        });
                    } else {
                        this.searchedUsers.push({
                            username: "Not Found",
                            address: '0x0'
                        })
                    }
                } else {
                    //Search username
                    let [addr, status] = await chatter.searchUsername(query);
                    if (status) {
                        this.searchedUsers.push({
                            username: query,
                            address: addr
                        });
                    } else {
                        this.searchedUsers.push({
                            username: "Not Found",
                            address: '0x0'
                        })
                    }
                }
            }
        }
    }

    
});
</script>

<style>
#chat-contacts-list {
    height: 75%;
    vertical-align: middle;
    width: 75%;
    position: absolute;
    background-color: #efeff4;
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

#chat-contacts-list-group {
    text-align: left
}
#chat-contacts-list-group p {
    margin-bottom: 0;
}
</style>
