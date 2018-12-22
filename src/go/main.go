package main

import (
	"encoding/base64"

	rsaCrypt "./rsa-crypt"
	"github.com/gopherjs/gopherjs/js"
)

type JsRsaCrypt struct {
	crypt *rsaCrypt.ChatCrypto
}

func (c *JsRsaCrypt) GetPublicKey() string {
	return base64.StdEncoding.EncodeToString(c.crypt.GetPublicKey())
}

func (c *JsRsaCrypt) EncryptWithPubKey(publicKey string, plainText string) (text string, status bool) {
	res, err := c.crypt.EncryptString(plainText, publicKey)
	if err != nil {
		println(err)
		return "", false
	}
	return res, true
}

func (c *JsRsaCrypt) Decrypt(cipherText string) (text string, status bool) {
	res, err := c.crypt.DecryptString(cipherText)
	if err != nil {
		println(err)
		return "", false
	}
	return res, true
}

func (c *JsRsaCrypt) Sign(message string) (string, bool) {
	sig, err := c.crypt.SignMessageString(message)
	if err != nil {
		println(err)
		return "", false
	}
	return sig, true
}

func (c *JsRsaCrypt) Verify(message, signature, publicKey string) bool {
	err := c.crypt.VerifySigningString(message, signature, publicKey)
	if err != nil {
		println(err)
		return false
	}
	return true
}

func main() {
	//Contaminate the JavaScript global scope
	js.Global.Set("RsaCrypt", map[string]interface{}{
		"New": func(addr, pass string) *js.Object {
			crypt, err := rsaCrypt.NewChatCrypto(addr, pass)
			if err != nil {
				println(err)
			}
			return js.MakeWrapper(&JsRsaCrypt{
				crypt: crypt,
			})
		},
	})
}
