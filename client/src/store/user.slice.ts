import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { LoginResponse } from "../interfaces/auth.interface";
import axios, { AxiosError } from "axios";
import { BASE_URL_API } from "../helpers/API";

export const TOKEN_PERSISTENT_STATE = "userData";

export interface UserPersistentState {
  token: string | null;
}
export interface UserState {
  token: string | null;
  loginErrorMessage?: string;
  registrationErrorMessage?: string;
}

const initialState: UserState = {
  token: loadState<UserPersistentState>(TOKEN_PERSISTENT_STATE)?.token ?? null,
};

export const login = createAsyncThunk(
  "user/login",
  async (params: { email: string; password: string }) => {
    try {
      const { data } = await axios.post<LoginResponse>(
        `${BASE_URL_API}/user/login`,
        {
          email: params.email,
          password: params.password,
        },
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
    }
  },
);

export const registration = createAsyncThunk(
  "user/registration",
  async (params: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => {
    try {
      const { data } = await axios.post(`${BASE_URL_API}/user/registration`, {
        email: params.email,
        password: params.password,
        name: params.name,
        phone: params.phone,
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
    },
    clearLoginErrorMessage: (state) => {
      state.loginErrorMessage = undefined;
    },
    clearRegistrationErrorMessage: (state) => {
      state.registrationErrorMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loginErrorMessage = action.error.message;
    });
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
