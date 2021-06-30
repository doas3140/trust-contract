import React from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  InputAdornment,
  ListItemAvatar,
  Avatar,
  ButtonBase,
} from "@material-ui/core";
import { TrustContract } from "../components";
import { useSelector, useDispatch } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { PayCircleOutlined, BankOutlined, UserOutlined } from "@ant-design/icons";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { notification, Typography } from "antd";
import { useHistory, useParams } from "react-router-dom";
import Blockies from "react-blockies";
import Divider from "@material-ui/core/Divider";
import { ReduxMain } from "../redux/slice-main";

const { Text } = Typography;

export default function ProfileView(props) {
  const dispatch = useDispatch();
  const pathParams = useParams();
  const profileAddress = pathParams["address"];
  const { writeContracts, readContracts, tx } = props;
  const { id2contract, user, address2ids, users } = useSelector(state => state.main);

  const ids = address2ids[profileAddress] || [];
  const contracts = ids.map(id => id2contract[id]);

  const [loading, setLoading] = React.useState(false);
  const load = async promise => {
    setLoading(true);
    let out;
    try {
      out = await promise;
    } catch (e) {
      notification.error({
        message: "Transaction Error",
        description: e.message.replace("VM Exception while processing transaction: revert", ""),
      });
    }
    setLoading(false);
    return out;
  };

  const foundUser = users.find(user => user.address == profileAddress);
  const name = (foundUser && foundUser.name) || "unknown";

  const [balance, setBalance] = React.useState(undefined);

  const refreshBalance = () => {
    readContracts.TrustContract.balanceOf(profileAddress)
      .then(Number)
      .then(setBalance)
      .catch(e => {
        notification.error({
          message: "Transaction Error",
          description: e.message.replace("VM Exception while processing transaction: revert", ""),
        });
      });
  };

  React.useEffect(refreshBalance, []);

  // dialog
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [value, setValue] = React.useState(1);
  const [address, setAddress] = React.useState(profileAddress);

  const handleDialogAccept = () => {
    tx(writeContracts.TrustContract.transfer(address, value))
      .then(() => {
        refreshBalance();
        dispatch(ReduxMain.refreshMyUser(readContracts, props.address));
        handleClose();
      })
      .catch(e => {
        notification.error({
          message: "Transaction Error",
          description: e.message.replace("VM Exception while processing transaction: revert", ""),
        });
      });
  };

  return (
    <>
      {loading && <LinearProgress />}
      <Container maxWidth="md">
        <ListItem>
          <span style={{ verticalAlign: "middle" }}>
            <Blockies seed={profileAddress.toLowerCase()} size={8} scale={4} />
          </span>
          <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 28 }}>
            <Text copyable={{ text: profileAddress }}>{name}</Text>
          </span>
          {balance && (
            <div style={{ marginLeft: 5, display: "flex", alignItems: "center", height: 28, paddingBottom: 2 }}>
              <Typography.Text style={{ fontSize: 28, paddingRight: 2 }}>{balance}</Typography.Text>
              <PayCircleOutlined
                style={{
                  fontSize: 28,
                }}
              />
            </div>
          )}
          <div style={{ flexGrow: 1 }} />
          <Text style={{ fontSize: 28 }}>User Contracts</Text>
          <div style={{ flexGrow: 1 }} />
          <Button onClick={() => setOpen(true)}> {`SEND MONEY TO ${name}`}</Button>
        </ListItem>
        <Divider />
        <List>
          {contracts.map(contract => (
            <TrustContract
              key={contract.id}
              address={user.address}
              {...contract}
              onAcceptorAccept={async (action, passphrase) => {
                load(
                  tx(writeContracts.TrustContract.acceptorAcceptContract(contract.id, action == "steal", passphrase)),
                );
              }}
              onCreatorAccept={action => {
                load(tx(writeContracts.TrustContract.creatorPublishAction(contract.id, action == "steal")));
              }}
              onAcceptorVerify={(action, passphrase) => {
                load(tx(writeContracts.TrustContract.acceptorVerifyAction(contract.id, action == "steal", passphrase)));
              }}
            />
          ))}
        </List>
      </Container>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{`Send money to ${name}`}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Please remember this pass
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="value"
            label="Value"
            fullWidth
            value={value}
            onChange={e => setValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PayCircleOutlined />
                </InputAdornment>
              ),
            }}
          />
          {/* <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            fullWidth
            value={address}
            onChange={e => setAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <UserOutlined />
                </InputAdornment>
              ),
            }}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogAccept} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
