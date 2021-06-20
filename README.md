# 🤞 trust-contract

## 🛠️ Dev Setup

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
yarn install
```

`in seperate CLI windows run:`

```bash
# start local blockchain
yarn chain
```

```bash
# start react app
yarn start
```

```bash
# deploy contract
yarn deploy
```

## 📡 Deploy Smart Contract

1. Change blockchain network

```javascript
// App.jsx
export const targetNetwork = NETWORKS.localhost;
// >>>
export const targetNetwork = NETWORKS['rinkeby'];
```

2. Generate deployment account

```bash
yarn generate
yarn account
```

3. Add ethereum via https://faucet.rinkeby.io/

4. Deploy

```bash
yarn deploy
```

## 🌐 Deploy React App

```bash
yarn build
yarn surge
```
