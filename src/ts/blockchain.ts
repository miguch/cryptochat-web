/*** This file contains code to interact with blockchain using web3 */
import Eth from 'ethjs'

import info from "./contractInfo";

let abi = info.abi;
let contractAddr: string;


window.web3 = window.web3 || undefined;

let contract: any;
let eth: any;

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
        window.web3 = new Web3(window.web3.currentProvider);
        eth = new Eth(window.web3.currentProvider);
    } else {
        alert('web3 Not Detected! You should consider trying MetaMask!');
        return;
    }

    switch (window.web3.version.network) {
        case '1':
            alert('We do not support running on the mainnet yet!');
            break;
        case '2':
            alert('We do not support running on the morden net!');
            break;
        case '3':
            contractAddr = info.address.ropsten;
            break;
        case '42':
            alert('We do not support running on the koven net yet!');
            break;
        case '4':
            alert('We do not support running on the Rinkeby net yet!');
            break;
        default:
            contractAddr = info.address.ganache;
    }

    //Bind contract
    contract = eth.contract(abi).at(contractAddr);

    window.web3.currentProvider.enable();
});

export default new class {
    get Contract() {
        return contract;
    }
    get Eth() {
        return eth;
    }
    get Address() {
        return window.web3 ? window.web3.eth.accounts[0] : undefined;
    }
    get web3() {
        return window.web3;
    }
    get contractAddress(): string {
        return contractAddr;
    }
    checkValidAddress(address: string): boolean {
        let format = /^(0x)?[0-9a-f]{40}$/i;
        return format.test(address);
    }
    setNewContractAddress(address: string) {
        contractAddr = address
        contract = eth.contract(abi).at(address);
    }
    etherToWei(ethers: number) {
        return window.web3.toWei(ethers, "ether");
    }
};

