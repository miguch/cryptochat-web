# CryptoChat-web

本仓库为 CryptoChat 项目的 web 前端部分，使用 TypeScript 作为主要语言编写，框架为 Vue，使用 Webpack 构建。

[合约仓库](https://github.com/miguch/cryptochat)

[CryptoChat (支持 Ropsten 测试网络)](https://cryptochat.miguch.com)

## CryptoChat 简介

CryptoChat 是一个利用以太坊平台实现的去中心化应用，目的是实现去中心化的安全简讯通信，避免在通信过程中发生的聊天数据泄露，数据被监听、篡改等情况。通过前端的配合将加密后的聊天数据发送至区块链上，利用 RSA 等非对称加密算法使得只有知道私钥的用户才可对聊天信息进行解密，实现安全的简讯通信。

## 构建

**构建项目，生成静态文件至 dist 目录**

```
npm run build
```

**使用 webpack-dev-server搭建用于开发的服务器，监听在8082端口**

```
npm run serve
```



## Web 前端实现简介

