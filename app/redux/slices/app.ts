import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  username: string;
}

const initialState: AppState = {
  username: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { setAppUsername } = appSlice.actions;

export default appSlice.reducer;
