import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ButtonBase,
  Badge,
  Button,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import CircularProgress from "@material-ui/core/CircularProgress";
import { green, red, grey, blue } from "@material-ui/core/colors";
import Blockies from "react-blockies";
import { useSelector, useDispatch } from "react-redux";
import { GiRobber } from "react-icons/gi";
import { FaRegHandshake, FaQuestion } from "react-icons/fa";
import { RiLock2Line, RiZzzLine, RiRestTimeLine } from "react-icons/ri";
import { BiRefresh } from "react-icons/bi";
import { useHistory } from "react-router-dom";

export const Hidden = props => <div style={{ visibility: "hidden" }}>{props.children}</div>;

const SmallAvatar = withStyles(theme => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const Actions = {
  Coop: props => (
    <Avatar
      style={{ backgroundColor: green[200], border: `3px solid ${grey[200]}`, [props.onClick && "cursor"]: "pointer" }}
      onClick={props.onClick}
    >
      <FaRegHandshake size={38} />
    </Avatar>
  ),
  Rob: props => (
    <Avatar
      style={{ backgroundColor: red[200], border: `3px solid ${grey[200]}`, [props.onClick && "cursor"]: "pointer" }}
      onClick={props.onClick}
    >
      <GiRobber size={80} />
    </Avatar>
  ),
  Sleep: props => (
    <Avatar style={{ backgroundColor: blue[200], border: `3px solid ${grey[200]}` }}>
      <RiZzzLine size={20} />
    </Avatar>
  ),
  Lock: props => (
    <Avatar style={{ backgroundColor: grey[400], border: `3px solid ${grey[200]}` }}>
      <FaQuestion size={20} />
    </Avatar>
  ),
  LockWithRefresh: props => {
    const [loading, setLoading] = React.useState(false);
    const load = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    return (
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        badgeContent={
          loading ? (
            <SmallAvatar>
              <CircularProgress size={10} style={{ color: "white" }} />
            </SmallAvatar>
          ) : (
            <SmallAvatar style={{ cursor: "pointer" }} onClick={load}>
              <BiRefresh />
            </SmallAvatar>
          )
        }
      >
        <Avatar style={{ backgroundColor: grey[400], border: `3px solid ${grey[200]}` }}>
          <FaQuestion size={20} />
        </Avatar>
      </Badge>
    );
  },
};

const displayBalanceChange = change => (change > 0 ? `(+${change})` : `(${change})`);

const ShowAction = props => {
  if (props.action == "steal") return <Actions.Rob onClick={props.onClick} />;
  if (props.action == "coop") return <Actions.Coop onClick={props.onClick} />;
  if (props.action == "sleep") return <Actions.Sleep />;
  if (props.action == "question") return <Actions.Lock />;
  if (props.action == "question-refresh") return <Actions.LockWithRefresh />;
  return (
    <Hidden>
      <Actions.Lock />
    </Hidden>
  );
};

const SelectAction = props => {
  const [action, setAction] = React.useState("coop");

  const changeAction = () => {
    let newAction = "coop";
    if (action == "coop") newAction = "steal";
    setAction(newAction);
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const handleAccept = () => {
    if (props.step == 2) {
      props.onCreatorAccept(action);
    } else {
      setOpen(true);
    }
  };

  const [passphrase, setPassphrase] = React.useState("");

  const handleDialogAccept = () => {
    if (props.step == 1) props.onAcceptorAccept(action, passphrase);
    if (props.step == 3) props.onAcceptorVerify(action, passphrase);
    setOpen(false);
  };

  return (
    <>
      <div style={{ flex: 1, display: "flex", ...props.style }}>
        <div style={{ flex: 1 }} />
        {props.step != 3 && (
          <Button style={{ marginRight: 10 }} onClick={handleAccept}>
            ACCEPT
          </Button>
        )}
        <ShowAction action={action} onClick={changeAction} />
        {props.step == 3 && (
          <Button style={{ marginLeft: 10 }} onClick={handleAccept}>
            VERIFY
          </Button>
        )}
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {/* <DialogTitle id="form-dialog-title">Lock your answer</DialogTitle> */}
        <DialogContent>
          {/* <DialogContentText>
            Please remember this pass
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Passphrase"
            fullWidth
            value={passphrase}
            onChange={e => setPassphrase(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon />
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
            {props.step == 3 ? `Verify` : `Accept`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function TrustContract(props) {
  const history = useHistory();
  const { address, creator, acceptor, value, step } = props;
  const isCreator = creator && address == creator.address;
  const isAcceptor = acceptor && address == acceptor.address;
  // const { users } = useSelector(state => state.main);
  return (
    <ListItem style={{ position: "relative" }} onClick={() => console.log()}>
      <ListItemAvatar
        style={{ position: "relative", display: "flex", justifyContent: "center" }}
        onClick={() => {
          history.push(`/profile/${creator.address}`);
        }}
      >
        <ButtonBase style={{ position: "absolute", height: "100%", width: "100%", zIndex: 99 }} />
        <Avatar variant="rounded">{<Blockies seed={creator.address.toLowerCase()} size={10} />}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={creator.name}
        secondary={
          <span>
            {`${creator.oldBalance}￥`}
            {creator.balanceChange && (
              <span style={{ color: creator.balanceChange > 0 ? green[500] : red[500] }}>
                {displayBalanceChange(creator.balanceChange)}
              </span>
            )}
          </span>
        }
        style={{ flex: 1 }}
      />

      <ShowAction action={!(step == 2 && isCreator) && creator.action} />

      <div
        style={{
          padding: 2,
          border: `3px solid ${grey[200]}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 4,
          position: "relative",
          width: 60,
        }}
      >
        <div>{`${value}￥`}</div>
        {/* <div style={{ fontSize: 12, color: grey[700], lineHeight: 0.1, paddingBottom: 5 }}>bet</div> */}
        {/* DONT MIND ME (just using position relative element for easier placment) :) */}
        {step == 2 && isCreator && (
          <SelectAction
            onCreatorAccept={action => props.onCreatorAccept(action)}
            step={step}
            style={{ position: "absolute", top: -8, right: 62 }}
            onAccept={action => props.onCreatorAccept(action)}
          />
        )}
        {step == 3 && isAcceptor && (
          <SelectAction
            onAcceptorVerify={(action, passphrase) => props.onAcceptorVerify(action, passphrase)}
            step={step}
            style={{ position: "absolute", top: -8, left: 62 }}
          />
        )}
      </div>

      <ShowAction action={!(step == 3 && isAcceptor) && acceptor && acceptor.action} />

      {step == 1 && (
        <>
          <Hidden>
            <ListItemAvatar style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <Avatar variant="rounded">{<Blockies seed="test" size={10} />}</Avatar>
            </ListItemAvatar>
          </Hidden>
          <SelectAction
            onAcceptorAccept={(action, passphrase) => props.onAcceptorAccept(action, passphrase)}
            step={step}
            style={{ [isCreator && "visibility"]: "hidden" }}
            onAccept={action => props.onAccept(action)}
          />
        </>
      )}

      {acceptor && (
        <>
          <ListItemText
            primary={acceptor.name}
            secondary={
              <span>
                {acceptor.balanceChange && (
                  <span style={{ color: acceptor.balanceChange > 0 ? green[500] : red[500] }}>
                    {displayBalanceChange(acceptor.balanceChange)}
                  </span>
                )}
                {` ${acceptor.oldBalance}￥`}
              </span>
            }
            style={{ textAlign: "right", flex: 1 }}
          />
          <ListItemAvatar
            style={{ position: "relative", display: "flex", justifyContent: "center" }}
            onClick={() => {
              history.push(`/profile/${acceptor.address}`);
            }}
          >
            <Avatar variant="rounded">{<Blockies seed={acceptor.address.toLowerCase()} size={10} />}</Avatar>
          </ListItemAvatar>
        </>
      )}
    </ListItem>
  );
}
