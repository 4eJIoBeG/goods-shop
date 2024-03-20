import { configureStore } from "@reduxjs/toolkit";
import userSlice, { TOKEN_PERSISTENT_STATE } from "./user.slice";
import { saveState } from "./storage";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

store.subscribe(() => {
  saveState({ token: store.getState().user.token }, TOKEN_PERSISTENT_STATE);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
