import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  route: "/"
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

export const ReduxMain = {
  reducer: slice.reducer,
  ...slice.actions,
};
