//This file is the type declaration of the rsaCrypt written in Go.

declare class cryptObject {
    GetPublicKey(): string;
    EncryptWithPubKey(publicKey: string, plainText: string): [string, boolean];
    Decrypt(cipher: string): [string, boolean];
    Sign(message: string): [string, boolean];
    Verify(message: string, signature: string, publicKey: string): boolean
}

declare namespace RsaCrypt {
    function New(address: string, passphrase: string): cryptObject;
}

