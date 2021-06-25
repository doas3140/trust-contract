import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  user: {},
};

const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setState(state, action) {
      const newState = action.payload;
      return { ...state, ...newState };
    },
  },
});

// const refreshUsers = ({ TrustContract }) => async dispatch => {
//   let names = [];
//   const count = await TrustContract.getUserCount();
//   for (let i = count - 1; i >= 0; i--) {
//     const name = await TrustContract.names(i);
//     console.log("[redux:name]", name);
//     names = [...names, name];
//     dispatch(slice.actions.setState({ names }));
//   }
// };

const refreshMyUser = ({ TrustContract }, address) => async dispatch => {
  dispatch(slice.actions.setState({ user: { address, loading: true } }));
  const name = await TrustContract.address2name(address);
  dispatch(slice.actions.setState({ user: { name, address, loading: true } }));
  const balance = await TrustContract.address2balance(address);
  dispatch(slice.actions.setState({ user: { balance: Number(balance), name, address, loading: false } }));
};

const refreshBank = ({ TrustContract }) => async dispatch => {
  const name = "bank";
  dispatch(slice.actions.setState({ bank: { name, loading: true } }));
  const address = await TrustContract.name2address(name);
  dispatch(slice.actions.setState({ bank: { name, address, loading: true } }));
  const balance = await TrustContract.address2balance(address);
  dispatch(slice.actions.setState({ bank: { balance: Number(balance), name, address, loading: false } }));
};

export const ReduxMain = {
  reducer: slice.reducer,
  ...slice.actions,
  // refreshUsers,
  refreshMyUser,
  refreshBank,
};
