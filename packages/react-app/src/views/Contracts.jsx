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
import { PayCircleOutlined, BankOutlined } from "@ant-design/icons";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { notification } from "antd";

export default function ContractsView(props) {
  const { writeContracts, readContracts, tx } = props;
  const [loading, setLoading] = React.useState(false);
  const { contracts, user } = useSelector(state => state.main);
  console.log('#', contracts)
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
  // dialog
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [value, setValue] = React.useState(1);

  const handleDialogAccept = () => {
    tx(writeContracts.TrustContract.createTrustContract(value))
      .then(() => {
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
      <Fab
        onClick={() => setOpen(true)}
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: 80, right: 20 }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create New Contract</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Please remember this pass
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Contract Value"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogAccept} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
