import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/app";
import hudReducer from "./slices/hud";

export const store = configureStore({
  reducer: {
    app: appReducer,
    hud: hudReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
