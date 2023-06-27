import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/app";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
