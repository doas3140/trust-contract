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

const Item = props => {
  const [address, setAddress] = React.useState();
  React.useEffect(() => {
    props.readContracts.TrustContract.name2address(props.name).then(setAddress);
  }, []);

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

export default function NamesView(props) {
  const { names } = useSelector(state => state.main);
  return (
    <Container maxWidth="md">
      <List>
        {names.map(name => (
          <Item key={name} name={name} {...props} />
        ))}
      </List>
    </Container>
  );
}
