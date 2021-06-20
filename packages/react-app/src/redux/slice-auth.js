import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setState(state, action) {
      const newState = action.payload;
      return { ...state, ...newState };
    },
  },
});

export const ReduxAuth = {
  reducer: slice.reducer,
  ...slice.actions,
};
