//Deprecated after switching to Go for encryption

//Declare file of only the RSA part of the cryptico library

declare class RSAKey {
    n: any;
    e: any;
    d: any;
    p: any;
    q: any;
    dmp1: any;
    dmq1: any;
    coeff: any;
}

declare namespace cryptico {
    function generateRSAKey(passphrase: string, bitLength: number): RSAKey;
    function publicKeyString(rsakey: string): string;
    function publicKeyID(publicKeyString: string): string;
    function encrypt(plaintext: string, publicKeyString: string, signingKey: RSAKey): {
        status: string;
        cipher: string|undefined;
    };
    function decrypt(ciphertext: string, key: RSAKey): {
        status: string;
        plaintext: string|undefined;
        signature: string|undefined;
        publicKeyString: string|undefined;
    }

}