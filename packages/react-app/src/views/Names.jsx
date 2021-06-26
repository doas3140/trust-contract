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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Item = props => {
  const address = props.address;
  const history = useHistory();
  // const [address, setAddress] = React.useState();
  // React.useEffect(() => {
  //   props.readContracts.TrustContract.name2address(props.name).then(setAddress);
  // }, []);

  return (
    <ListItem style={{ position: "relative" }} onClick={() => history.push(`/profile/${address}`)}>
      <ListItemAvatar>
        <Avatar variant="rounded">{address && <Blockies seed={address.toLowerCase()} size={10} />}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.name} secondary={address && address} />
      <ButtonBase style={{ position: "absolute", height: "100%", width: "100%" }} />
    </ListItem>
  );
};

export default function NamesView(props) {
  const { users } = useSelector(state => state.main);
  return (
    <Container maxWidth="md">
      <List>
        {users.map(({ name, address }) => (
          <Item key={name} name={name} address={address} {...props} />
        ))}
      </List>
    </Container>
  );
}
