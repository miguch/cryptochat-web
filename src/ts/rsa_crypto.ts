/*** This file contains the code associated with the RSA encryption and digital
 signing used to encrypt, decrypt and sign messages and user information sent
 by users. RSAcrypt written in Go is used to finish the task. */

/// <reference path="./rsaCrypt.d.ts" />

class cryptoUtils {
    public readonly crypt: cryptObject | undefined = undefined;

    constructor(addr: string, pass: string) {
        this.crypt = RsaCrypt.New(addr, pass);
    }

    public GetPublicKey(): string {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        return this.crypt.GetPublicKey();
    }

    public EncryptWithSelfPubKey(obj: any) : [string, boolean] {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        let objJson = JSON.stringify(obj);
        return this.crypt.EncryptWithPubKey(this.GetPublicKey(), objJson);
    }

    public GetObjectEncryptedJson(obj: any, publicKey: string): [string, boolean] {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        let objJson = JSON.stringify(obj);
        return (<cryptObject>this.crypt).EncryptWithPubKey(publicKey, objJson);
    }
    
    public VerifyKey(publicKey: string, keySig: string): boolean {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        return this.crypt.Verify(publicKey, keySig, publicKey);
    }

    public VerifyMessage(message: string, sig: string, publicKey: string): boolean {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        return this.crypt.Verify(message, sig, publicKey);
    }

    public SignMessage(message: string): [string, boolean] {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        return this.crypt.Sign(message);
    }

    public DecryptObject(objCipher: string): [any, boolean] {
        if (typeof this.crypt === 'undefined') {
            throw "Crypt not initialized";
        }
        let [objJson, status] = this.crypt.Decrypt(objCipher);
        if (!status) {
            return [null, false];
        } else {
            return [JSON.parse(objJson), true];
        }
    }
}

export default cryptoUtils;
