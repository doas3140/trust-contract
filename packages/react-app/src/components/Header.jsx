import { PageHeader } from "antd";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { Account } from "../components";
import {INFURA_ID} from "../constants";
import {
  useExchangePrice,
  useUserProvider,
  useGasPrice,
  useBalance
} from "../hooks";
import {scaffoldEthProvider, mainnetInfura, targetNetwork, localProvider, blockExplorer} from '../App'
import { Transactor } from "../helpers";
import { Button} from "antd";
import { formatEther, parseEther } from "@ethersproject/units";
import BurnerProvider from "burner-provider";
import * as bip39 from "bip39";

// displays a page header

/*
  Web3 modal helps us "connect" external wallets:
*/
function generateMnemonic(){
  const mnemonic = bip39.generateMnemonic()
  return mnemonic.split(' ').slice(0,3).join(' ')
}

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
    "custom-mnemonic": {
      display: {
        logo: "/mnemonic.png",
        name: "Custom Mnemonic",
        description: "Connect With Custom Mnemonic"
      },
      package: BurnerProvider,
      options: {
        mnemonic: 'sad asdasd asd'
      },
      connector: async (ProviderPackage, options) => {
        if(!localStorage.getItem("mnemonic")){
          const mnemonic = prompt("Please enter mnemonic:", generateMnemonic());
          window.localStorage.clear();
          window.localStorage.setItem("mnemonic", mnemonic);
          window.location.reload();
        }
        const provider = new ProviderPackage(options);
        return provider;
      }
    }
  },
});

const logoutOfWeb3Modal = async () => {
  localStorage.clear()
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default function Header() {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);
  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);
  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);
  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  
  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  let faucetHint = "";
  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  return (
    <div style={{display: 'flex'}}>
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🤞 trust-contract"
        subTitle=""
        style={{ cursor: "pointer" }}
      />
    </a>
    <div style={{flexGrow:1}}/>
    <div style={{padding: 16}}>
      <Account
        address={address}
        localProvider={localProvider}
        userProvider={userProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
      />
    </div>
    <div style={{ position: "fixed", textAlign: "right", right: 0, bottom: 50, padding: 10 }}>
      {faucetHint}
    </div>
    </div>
  );
}

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */