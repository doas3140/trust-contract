import React from "react";
import { Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, ButtonBase } from "@material-ui/core";
import Blockies from "react-blockies";
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
} from "../hooks";
import { TrustContract } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { GiRobber } from "react-icons/gi";
import { FaRegHandshake } from "react-icons/fa";
import { RiLock2Line } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";

const Item = props => {
  const address = props.address;
  // const [address, setAddress] = React.useState();
  // React.useEffect(() => {
  //   props.readContracts.TrustContract.name2address(props.name).then(setAddress);
  // }, []);

  return (
    <ListItem style={{ position: "relative" }} onClick={() => console.log(props.name)}>
      <ListItemAvatar>
        <Avatar variant="rounded">{address && <Blockies seed={address.toLowerCase()} size={10} />}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.name} secondary={address && address} />
      <ButtonBase style={{ position: "absolute", height: "100%", width: "100%" }} />
    </ListItem>
  );
};

export default function ContractsView(props) {
  const { users } = useSelector(state => state.main);
  return (
    <Container maxWidth="md">
      {/* step 1 */}
      <TrustContract
        {...{
          address: "0x1",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            // balanceChange: 20,
            // action: "steal",
          },
          // acceptor: {
          //   name: "Adomas",
          //   address: "A0x213",
          //   oldBalance: 2100,
          //   // balanceChange: -220,
          //   action: "question",
          // },
          value: 100,
          step: 1,
        }}
      />
      <TrustContract
        {...{
          address: "0x2",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            // balanceChange: 20,
            // action: "steal",
          },
          // acceptor: {
          //   name: "Adomas",
          //   address: "A0x213",
          //   oldBalance: 2100,
          //   // balanceChange: -220,
          //   action: "question",
          // },
          value: 100,
          step: 1,
        }}
      />
      {/* step 2 */}
      <TrustContract
        {...{
          address: "0x1",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            // balanceChange: 20,
            // action: "steal",
          },
          acceptor: {
            name: "Adomas",
            address: "0x2",
            oldBalance: 2100,
            // balanceChange: -220,
            action: "question",
          },
          value: 100,
          step: 2,
        }}
      />
      <TrustContract
        {...{
          address: "0x2",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            // balanceChange: 20,
            // action: "steal",
          },
          acceptor: {
            name: "Adomas",
            address: "0x2",
            oldBalance: 2100,
            // balanceChange: -220,
            action: "question",
          },
          value: 100,
          step: 2,
        }}
      />
      {/* step 3 */}
      <TrustContract
        {...{
          address: "0x1",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            // balanceChange: 20,
            action: "steal",
          },
          acceptor: {
            name: "Adomas",
            address: "0x2",
            oldBalance: 2100,
            // balanceChange: -220,
            action: "question",
          },
          value: 100,
          step: 3,
        }}
      />
      <TrustContract
        {...{
          address: "0x2",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            // balanceChange: 20,
            action: "steal",
          },
          acceptor: {
            name: "Adomas",
            address: "0x2",
            oldBalance: 2100,
            // balanceChange: -220,
            action: "question",
          },
          value: 100,
          step: 3,
        }}
      />
      {/* step 4 */}
      <TrustContract
        {...{
          address: "0x2",
          creator: {
            name: "domas",
            address: "0x1",
            oldBalance: 100,
            balanceChange: 20,
            action: "steal",
          },
          acceptor: {
            name: "Adomas",
            address: "0x2",
            oldBalance: 2100,
            balanceChange: -220,
            action: "steal",
          },
          value: 100,
          step: 4,
        }}
      />
      {/* <List>
        {users.map(({ name, address }) => (
          <Item key={name} name={name} address={address} {...props} />
        ))}
      </List> */}
    </Container>
  );
}
