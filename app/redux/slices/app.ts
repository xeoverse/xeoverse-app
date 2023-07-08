import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  username: string;
  isDriving: boolean;
}

const initialState: AppState = {
  username: "",
  isDriving: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setIsDriving: (state, action: PayloadAction<boolean>) => {
      state.isDriving = action.payload;
    }
  },
});

export const { setAppUsername, setIsDriving } = appSlice.actions;

export default appSlice.reducer;
