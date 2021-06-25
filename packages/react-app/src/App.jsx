import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { Account, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch, BottomNav } from "./components";
import { DAI_ABI, DAI_ADDRESS, INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useExternalContractLoader,
  useGasPrice,
  useOnBlock,
  useUserProvider,
  useContractUpdateListener
} from "./hooks";
// import Hints from "./Hints";
import { NamesView, ContractsExampleView, ContractsView } from "./views";
import { useSelector, useDispatch } from "react-redux";
import { ReduxMain } from "./redux/slice-main";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import MuiButton from "@material-ui/core/Button";
import { notification } from "antd";

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
export const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
export const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
export const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
export const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
export const blockExplorer = targetNetwork.blockExplorer;

function App(props) {
  const dispatch = useDispatch();
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader({ DAI: mainnetDAIContract }, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  const joiners = useEventListener(readContracts, "TrustContract", "JoinNetwork", localProvider, 1);
  const users = joiners.map(o => ({ address: o[0], name: o[1] }));

  const updates = useContractUpdateListener(readContracts, localProvider);
  // Start fetching data
  React.useEffect(() => {
    dispatch(ReduxMain.setState({ users }));
  }, [joiners.length]);

  React.useEffect(() => {
    if (!readContracts) return;
    // dispatch(ReduxMain.refreshUsers(readContracts));
    dispatch(ReduxMain.refreshMyUser(readContracts, address));
    dispatch(ReduxMain.refreshBank(readContracts));
  }, [readContracts]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetDAIContract
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetDAIContract);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetDAIContract,
  ]);

  const { user } = useSelector(state => state.main);

  let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, bottom: 100, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, bottom: 100, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <b>{networkLocal && networkLocal.name}</b>.
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div
        style={{ zIndex: -1, position: "absolute", right: 50, bottom: 100, padding: 16, color: targetNetwork.color }}
      >
        {targetNetwork.name}
      </div>
    );
  }

  const [inp, setInp] = React.useState("");

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name === "localhost";

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {DEBUG && networkDisplay}

      {user.loading ? (
        <div
          style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress />
        </div>
      ) : user.name ? (
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

              <Contract
                name="TrustContract"
                signer={userProvider.getSigner()}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
              />

              {/* uncomment for a second contract:
            <Contract
              name="SecondContract"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */}

              {/* Uncomment to display and interact with an external contract (DAI on mainnet):
            <Contract
              name="DAI"
              customContract={mainnetDAIContract}
              signer={userProvider.getSigner()}
              provider={mainnetProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */}
            </Route>
            <Route path="/names">
              <NamesView readContracts={readContracts} />
            </Route>
            <Route path="/contracts">
              <ContractsView readContracts={readContracts} />
            </Route>
            <Route path="/contracts-example">
              <ContractsExampleView readContracts={readContracts} />
            </Route>
          </Switch>

          <BottomNav />
        </BrowserRouter>
      ) : (
        <div
          style={{
            height: "calc(100vh - 100px)",
            flexDirection: "column",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Your account is not initialized!
          <Paper
            component="form"
            style={{ marginTop: 10, padding: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
          >
            <InputBase
              value={inp}
              onChange={e => setInp(e.target.value)}
              placeholder="Enter your name"
              style={{ marginLeft: 4, flex: 1 }}
            />
            <Divider orientation="vertical" style={{ height: 28, margin: 4 }} />
            <MuiButton
              onClick={async () => {
                try {
                  console.log("[", readContracts.TrustContract.on);
                  await writeContracts.TrustContract.joinNetwork(inp);
                  dispatch(ReduxMain.refreshMyUser(readContracts, address));
                } catch (e) {
                  notification.error({
                    message: "Transaction Error",
                    description: e.message.replace("VM Exception while processing transaction: revert", ""),
                  });
                }
                // readContracts.TrustContract.name2address(props.name).then(setAddress);
              }}
            >
              JOIN
            </MuiButton>
          </Paper>
        </div>
      )}

      <ThemeSwitch />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
