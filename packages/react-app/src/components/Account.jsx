import { Button, Typography } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { PayCircleOutlined, BankOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

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

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  value,
}) {
  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  const { currentTheme } = useThemeSwitcher();

  const color = currentTheme === "light" ? "#1890ff" : "#2caad9";
  const blackColor = currentTheme === "light" ? "#222222" : "#ddd";

  const { bank } = useSelector(state => state.main);
  const { user } = useSelector(state => state.main);

  const display = minimized ? (
    ""
  ) : (
    <div style={{ display: "flex" }}>
      {address ? (
        <Address value={value} address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
      ) : (
        "Connecting..."
      )}
      <span>
        <span style={{ display: "flex", flexDirection: "column", paddingLeft: 2, paddingRight: 2 }}>
          {user && user.balance && (
            <div style={{ display: "flex", alignItems: "center", height: 28, paddingBottom: 2 }}>
              <Typography.Text style={{ fontSize: 28, color: blackColor, paddingRight: 2 }}>
                {user.balance}
              </Typography.Text>
              <PayCircleOutlined
                style={{
                  color: blackColor,
                  fontSize: 28,
                }}
              />
            </div>
          )}
          {user && user.balance && bank && bank.balance && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 12 }}>
              <Typography.Text style={{ fontSize: 12, color: blackColor, paddingRight: 2 }}>
                {bank.balance}
              </Typography.Text>
              <BankOutlined style={{ fontSize: 12, color: blackColor }} />
            </div>
          )}
        </span>
      </span>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} color={color} />
        <Balance address={address} provider={localProvider} price={price} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      {display}
      {modalButtons}
    </div>
  );
}
