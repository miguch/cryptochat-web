package rsa_crypt

import (
	drr "./deterministic-random-reader"
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"io"
)

type ChatCrypto struct {
	Passphrase string
	UserAddress string
	RsaPrivateKey *rsa.PrivateKey
	randReader io.Reader
}

func NewChatCrypto(address, passphrase string) (*ChatCrypto, error) {
	randReader := drr.NewReader(passphrase, address)
	key, err := rsa.GenerateKey(randReader, 1024)
	if err != nil {
		return nil, err
	}
	return &ChatCrypto{
		Passphrase: passphrase,
		UserAddress: address,
		RsaPrivateKey: key,
		randReader: randReader,
	}, nil
}

func (cc *ChatCrypto) Encrypt(plainText, publicKey []byte) ([]byte, error) {
	pubKey, err := x509.ParsePKCS1PublicKey(publicKey)
	if err != nil {
		return []byte{}, err
	}
	return rsa.EncryptPKCS1v15(rand.Reader, pubKey, plainText)
}

func (cc *ChatCrypto) Decrypt(cipherText []byte) ([]byte, error) {
	return cc.RsaPrivateKey.Decrypt(rand.Reader, cipherText, nil)
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
	return rsa.SignPKCS1v15(rand.Reader, cc.RsaPrivateKey, crypto.SHA256, hashed[:])
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
