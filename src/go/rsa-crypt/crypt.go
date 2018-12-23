package rsa_crypt

import (
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/binary"
	"hash/fnv"
	"io"
	"math/rand"
	"strconv"

	"golang.org/x/crypto/pbkdf2"
)

func getBytesHash64(str []byte) uint64 {
	h := fnv.New64a()
	h.Write([]byte(str))
	return h.Sum64()
}

func getBytesHash32(str []byte) uint32 {
	h := fnv.New32a()
	h.Write([]byte(str))
	return h.Sum32()
}

type ChatCrypto struct {
	Passphrase    string
	UserAddress   string
	RsaPrivateKey *rsa.PrivateKey
	randReader    io.Reader
}

func NewChatCrypto(address, passphrase string) (*ChatCrypto, error) {
	salt := strconv.Itoa(len(address) + len(passphrase) + int(getBytesHash32([]byte(address+passphrase))))

	dk := pbkdf2.Key([]byte(passphrase+address), []byte(salt), 10000, 64, sha256.New)
	seed := int64(binary.LittleEndian.Uint64(dk))
	randReader := rand.New(rand.NewSource(seed))

	key, err := generateMultiPrimeKey(randReader, 2, 1024)
	if err != nil {
		return nil, err
	}
	return &ChatCrypto{
		Passphrase:    passphrase,
		UserAddress:   address,
		RsaPrivateKey: key,
		randReader:    randReader,
	}, nil
}

func (cc *ChatCrypto) Encrypt(plainText, publicKey []byte) ([]byte, error) {
	pubKey, err := x509.ParsePKCS1PublicKey(publicKey)
	if err != nil {
		return []byte{}, err
	}
	key, cipher, err := aesEncrypt(plainText)
	if err != nil {
		return []byte{}, err
	}
	encryptedKey, err := rsa.EncryptPKCS1v15(cc.randReader, pubKey, key)
	if err != nil {
		return []byte{}, err
	}
	cipher = append(encryptedKey, cipher...)

	return cipher, nil
}

func (cc *ChatCrypto) Decrypt(cipherText []byte) ([]byte, error) {
	const EncryptedKeyLength = 128
	//First 128 bytes is the encrypted AES key
	encryptedKey := cipherText[:EncryptedKeyLength]
	cipherText = cipherText[EncryptedKeyLength:]
	key, err := cc.RsaPrivateKey.Decrypt(cc.randReader, encryptedKey, nil)
	if err != nil {
		return []byte{}, err
	}
	return aesDecrypt(key, cipherText)
}

func (cc *ChatCrypto) GetPublicKey() []byte {
	keyBytes := x509.MarshalPKCS1PublicKey(&cc.RsaPrivateKey.PublicKey)
	return keyBytes
}

func (cc *ChatCrypto) EncryptString(plainText, publicKey string) (string, error) {
	key, err := base64.StdEncoding.DecodeString(publicKey)
	if err != nil {
		return "", err
	}
	res, err := cc.Encrypt([]byte(plainText), key)
	return base64.StdEncoding.EncodeToString(res), err
}

func (cc *ChatCrypto) DecryptString(cipherText string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(cipherText)
	if err != nil {
		return "", err
	}
	res, err := cc.Decrypt(data)
	return string(res), err
}

func (cc *ChatCrypto) SignMessage(message []byte) ([]byte, error) {
	hashed := sha256.Sum256(message)
	return rsa.SignPKCS1v15(cc.randReader, cc.RsaPrivateKey, crypto.SHA256, hashed[:])
}

func (cc *ChatCrypto) SignMessageString(message string) (string, error) {
	data, err := cc.SignMessage([]byte(message))
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(data), nil
}

func (cc *ChatCrypto) VerifySigning(message, signature, publicKey []byte) error {
	pubKey, err := x509.ParsePKCS1PublicKey(publicKey)
	if err != nil {
		return err
	}
	hashed := sha256.Sum256(message)
	return rsa.VerifyPKCS1v15(pubKey, crypto.SHA256, hashed[:], signature)
}

func (cc *ChatCrypto) VerifySigningString(message, signature, publicKey string) error {
	sigData, err := base64.StdEncoding.DecodeString(signature)
	if err != nil {
		return err
	}
	key, err := base64.StdEncoding.DecodeString(publicKey)
	if err != nil {
		return err
	}
	return cc.VerifySigning([]byte(message), sigData, key)
}
