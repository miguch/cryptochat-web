let contractAddr = {
    ganache: "0xfd699566d43446d901e5542aebe64d9c644a6e2e",
    ropsten: "0x03d9c77be859f0b0ffbf6547869f7a8e7ae021b0",
    rinkeby: "0x538132f00b5ccff2a5bdd7b0d790307b55d2819a"
};


let contractInfo = [
    {
        "constant": true,
        "inputs": [],
        "name": "getRecvMsgCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getUserRecvMsg",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getSentMsgCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getUserSentMsg",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "targetUser",
                "type": "address"
            },
            {
                "name": "recv_msg",
                "type": "string"
            },
            {
                "name": "send_msg",
                "type": "string"
            }
        ],
        "name": "sendMessage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCurrentAddr",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            }
        ],
        "name": "hasUser",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "pubKey",
                "type": "string"
            }
        ],
        "name": "checkNewUser",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "pubKey",
                "type": "string"
            },
            {
                "name": "sign",
                "type": "string"
            },
            {
                "name": "keySig",
                "type": "string"
            }
        ],
        "name": "addUser",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "username",
                "type": "string"
            }
        ],
        "name": "getAddrFromName",
        "outputs": [
            {
                "name": "target",
                "type": "address"
            },
            {
                "name": "status",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            }
        ],
        "name": "sendEther",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            }
        ],
        "name": "getUsername",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            }
        ],
        "name": "getUserPublicKey",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            }
        ],
        "name": "getUserSignature",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            }
        ],
        "name": "getUserKeySig",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

export default {
    abi: contractInfo,
    address: contractAddr
};