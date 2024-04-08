import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";

export const CART_PERSISTENT_STATE = "cartData";

export interface CartItem {
  id: number;
  count: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = loadState<CartState>(CART_PERSISTENT_STATE) ?? {
  items: [],
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cleanCart: (state) => {
      state.items = [];
    },
    delete: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    remove: (state, action: PayloadAction<number>) => {
      const existed = state.items.find((idx) => idx.id === action.payload);
      if (!existed) {
        return;
      }
      if (existed.count === 1) {
        state.items = state.items.filter((item) => item.id !== action.payload);
      } else {
        state.items.map((item) => {
          if (item.id === action.payload) {
            item.count -= 1;
          }
          return item;
        });
        return;
      }
    },
    add: (state, action: PayloadAction<number>) => {
      const existed = state.items.find((idx) => idx.id === action.payload);
      if (!existed) {
        state.items.push({ id: action.payload, count: 1 });
        return;
      }
      state.items.map((item) => {
        if (item.id === action.payload) {
          item.count += 1;
        }
        return item;
      });
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
