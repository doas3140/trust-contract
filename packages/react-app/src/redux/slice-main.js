import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  names: [],
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

const refreshUsers = ({TrustContract}) => async dispatch => {
  let names = []
    const count = await TrustContract.getUserCount();
    for (let i = count-1; i >= 0; i--) {
      const name = await TrustContract.names(i)
      console.log('[redux:name]', name)
      names = [...names, name]
      dispatch(slice.actions.setState({ names }));
    }
};

export const ReduxMain = {
  reducer: slice.reducer,
  ...slice.actions,
  refreshUsers,
};
