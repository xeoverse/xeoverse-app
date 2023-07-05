import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface HudState {
    activeHotbar: number;
}

const initialState: HudState = {
    activeHotbar: 1,
};

export const hudSlice = createSlice({
    name: "hud",
    initialState,
    reducers: {
        setActiveHotbar: (state, action: PayloadAction<number>) => {
            state.activeHotbar = action.payload;
        },
    },
});

export const { setActiveHotbar } = hudSlice.actions;

export default hudSlice.reducer;
