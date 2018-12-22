/*** This file contains code to interact with blockchain using web3 */
import Eth from 'ethjs'

import Chat from './chat';
import info from "./contractInfo";

let abi = info.abi;
let contractAddr = info.address;


window.web3 = window.web3 || undefined;

let contract: any;
let eth: any;
let chatter: Chat | undefined = undefined;

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
        window.web3 = new Web3(window.web3.currentProvider);
        eth = new Eth(window.web3.currentProvider);
    } else {
        alert('web3 Not Detected! You should consider trying MetaMask!');
        return;
    }

    //Bind contract
    contract = eth.contract(abi).at(contractAddr);

    window.web3.currentProvider.enable();

    chatter = new Chat(window.web3.eth.accounts[0]);
});

export = {
    getContract: function () {
        return contract;
    },
    getEth: function () {
        return eth;
    },
    getChatter: function () {
        return chatter
    },
    address: window.web3.eth.accounts[0]
};

