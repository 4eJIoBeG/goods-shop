import { configureStore } from "@reduxjs/toolkit";
import userSlice, { TOKEN_PERSISTENT_STATE } from "./user.slice";
import { saveState } from "./storage";
import itemSlice from "./item.slice";
import cartSlice, { CART_PERSISTENT_STATE } from "./cart.slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    item: itemSlice,
    cart: cartSlice,
  },
});

store.subscribe(() => {
  saveState({ token: store.getState().user.token }, TOKEN_PERSISTENT_STATE);
});

store.subscribe(() => {
  saveState(store.getState().cart, CART_PERSISTENT_STATE);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
