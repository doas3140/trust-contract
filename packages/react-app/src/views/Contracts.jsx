import React from "react";
import { Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, ButtonBase } from "@material-ui/core";
import { TrustContract } from "../components";
import { useSelector, useDispatch } from "react-redux";

export default function ContractsView(props) {
  const { contracts } = useSelector(state => state.main);
  return (
    <Container maxWidth="md">
      <List>
        {contracts.map(contract => (
          <TrustContract key={contract.id} {...contract} />
        ))}
      </List>
    </Container>
  );
}
