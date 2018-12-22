/** This file includes the code associated with controlling of the
 CryptoChat web interface */

import cryptoUtils from "./rsa_crypto"

window.cryptoUtils = cryptoUtils || undefined;

class Chat {
    public readonly selfAddress: string;
    private passphrase: string | undefined = undefined;
    private crypt: cryptoUtils | undefined = undefined;
    constructor(address: string) {
        this.selfAddress = address;
    }

    public attemptLogin(pass: string, publicKey: string, keySig: string) : boolean {
        let testCrypt = new cryptoUtils(this.selfAddress, pass);
        if (testCrypt.VerifyKey(publicKey, keySig) && testCrypt.GetPublicKey() == publicKey) {
            this.passphrase = pass;
            this.crypt = testCrypt;
            return true;
        }
        return false;
    }
}

window.Chat = Chat;

export = Chat;


