import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";

export const TOKEN_PERSISTENT_STATE = "userData";

export interface UserPersistentState {
  token: string | null;
}
export interface UserState {
  token: string | null;
}

const initialState: UserState = {
  token: loadState<UserPersistentState>(TOKEN_PERSISTENT_STATE)?.token ?? null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
