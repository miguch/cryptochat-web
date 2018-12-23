/** This file includes the code associated with controlling of the
 CryptoChat web interface */

import cryptoUtils from "./rsa_crypto"
import blockchainUtils from "./blockchain"

window.cryptoUtils = cryptoUtils || undefined;
window.getEth = function() {
    return blockchainUtils.Eth;
}

interface MessageData {
    content: string;
    sender: string;
    receiver: string;
    sendDate: Date;
}

interface UserInfo {
    username: string;
    address: string;
}

class Chat {
    public get selfAddress() {
        return blockchainUtils.Address;
    };
    private passphrase: string | undefined = undefined;
    private crypt: cryptoUtils | undefined = undefined;
    private signedIn = false;
    public sentMessages: Array<MessageData> = [];
    public recvMessages: Array<MessageData> = [];
    public chattedUsers: Set<string> = new Set();


    constructor() {

    } 

    public async createNewUser(newPass: string, username: string): Promise<[string, boolean]>{
        let testCrypt = new cryptoUtils(this.selfAddress, newPass);
        let pubKey = testCrypt.GetPublicKey();
        let preCheck = await blockchainUtils.Contract.checkNewUser(username, pubKey, {from: this.selfAddress});
        let errorCode = parseInt(preCheck[0]);
        switch (errorCode) {
            case 1:
            return ["User already exists", false];
            case 2:
            return ["Username is too long", false];
            case 3: 
            return ["Public key is in the wrong format", false];
            case 4:
            return ["Username already exists", false];
        }
        try {
            //Signing public key and user info
            let keySig = testCrypt.SignMessage(testCrypt.GetPublicKey())[0];
            let plainInfo = JSON.stringify({
                pubKey: testCrypt.GetPublicKey(),
                keySig,
                username: username,
                address: this.selfAddress,
            });
            let sig = await blockchainUtils.Eth.personal_sign(blockchainUtils.web3.fromUtf8(plainInfo), this.selfAddress);
            await blockchainUtils.Contract.addUser(username, testCrypt.GetPublicKey(), sig, keySig, {from: this.selfAddress});
            this.crypt = testCrypt;
            this.passphrase = newPass;
            this.signedIn = true;
            return ["", true];
        } catch (error){
            return [error, false];
        }
    }

    public async attemptLogin(pass: string) : Promise<boolean> {
        try {
            let testCrypt = new cryptoUtils(this.selfAddress, pass);
            let selfPubKey = (await blockchainUtils.Contract.getUserPublicKey(this.selfAddress))[0];
            let selfKeySig = (await blockchainUtils.Contract.getUserKeySig(this.selfAddress))[0];
            let username = (await blockchainUtils.Contract.getUsername(this.selfAddress))[0];
            let sig = (await blockchainUtils.Contract.getUserSignature(this.selfAddress))[0];
            let plainInfo = JSON.stringify({
                pubKey: selfPubKey,
                keySig: selfKeySig,
                username: username,
                address: this.selfAddress,
            });
            let signer = await blockchainUtils.Eth.personal_ecRecover(blockchainUtils.web3.fromUtf8(plainInfo), sig);
            if (signer != this.selfAddress) {
                return false;
            }
            if (testCrypt.VerifyKey(testCrypt.GetPublicKey(), selfKeySig) && testCrypt.GetPublicKey() === selfPubKey) {
                this.passphrase = pass;
                this.crypt = testCrypt;
                this.signedIn = true;
                //Start reading messages
                this.loadMessage();
                return true;
            }
            return false;
        } catch {
            return false;
        }
        
    }

    //Returns address and search status
    public async searchUsername(username: string): Promise<[string, boolean]> {
        if (username.length > 20) {
            return ["0x0", false];
        }
        let result = await blockchainUtils.Contract.getAddrFromName(username);
        return [result.target, result.status];
    }

    //Returns username and search status
    public async searchAddress(address: string): Promise<[string, boolean]> {
        let exists = (await blockchainUtils.Contract.hasUser(address))[0];
        if (!exists) {
            return ["", false];
        }
        let result = await blockchainUtils.Contract.getUsername(address);
        return [result[0], result.status];
    }


    //Returns error message and execute status
    public async sendMessage(targetAddress: string, message: string): Promise<[string, boolean]> {
        if (!this.signedIn) {
            return ["User not logged in.", false];
        }
        let userExists = (await blockchainUtils.Contract.hasUser(targetAddress))[0];
        if (!userExists) {
            return ["Target user does not exist.", false];
        }
        let messageData = JSON.stringify({
            content: message,
            receiver: targetAddress,
            sender: this.selfAddress,
            sendDate: Date.now()
        });
        let messageSign = (<cryptoUtils>this.crypt).SignMessage(messageData);
        if (!messageSign[1]) {
            return ["Fail to sign message.", false];
        }
        let signedMessage = {
            messageData,
            sign: messageSign[0],
        };
        
        try {
            let recvPubKey = (await blockchainUtils.Contract.getUserPublicKey(targetAddress))[0];
            let senderEncrypted = (<cryptoUtils>this.crypt).EncryptWithSelfPubKey(signedMessage);
            let recvEncrypted = (<cryptoUtils>this.crypt).EncryptWithPubKey(signedMessage, recvPubKey);
            if (!senderEncrypted[1] || !recvEncrypted[1]) {
                return ["Fail to encrypt message.", false];
            }
            await blockchainUtils.Contract.sendMessage(targetAddress, recvEncrypted, senderEncrypted, {from: this.selfAddress});
            return ["", true];
        } catch {
            return ["Fail to send encrypted message.", false];
        }

    }

    public async loadMessage(): Promise<void> {
        if (typeof this.crypt === 'undefined') {
            return;
        }
        let recvCount = await blockchainUtils.Contract.getRecvMsgCount({from: this.selfAddress});
        let sentCount = await blockchainUtils.Contract.getSentMsgCount({from: this.selfAddress});

        for (let i = 0; i < recvCount; i++) {
            let cipher = (await blockchainUtils.Contract.getUserRecvMsg(i, {from: this.selfAddress}))[0];
            let [msg, status] = this.crypt.DecryptObject(cipher);
            if (!status) {
                continue;
            }
            //check signature
            let originData = JSON.stringify(msg.messageData);
            let senderPubKey = (await blockchainUtils.Contract.GetPublicKey(msg.messageData.sender));
            status = this.crypt.VerifyMessage(originData, msg.sign, senderPubKey);
            if (!status) {
                continue;
            }
            this.chattedUsers.add(msg.messageData.sender);
            this.recvMessages.push(msg.messageData);
        }

        for (let i = 0; i < sentCount; i++) {
            let cipher = (await blockchainUtils.Contract.getUserSentMsg(i, {from: this.selfAddress}))[0];
            let [msg, status] = this.crypt.DecryptObject(cipher);
            if (!status) {
                continue;
            }
            //check signature
            let originData = JSON.stringify(msg.messageData);
            status = this.crypt.VerifyMessage(originData, msg.sign, this.crypt.GetPublicKey());
            if (!status) {
                continue;
            }
            this.chattedUsers.add(msg.messageData.receiver);
            this.sentMessages.push(msg.messageData);
        }
    }


}

let chatter = new Chat();
window.Chat = chatter;

export default chatter;


