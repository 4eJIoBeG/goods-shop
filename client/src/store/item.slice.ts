import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_URL_API } from "../helpers/API";
import { ApiResponse, Product } from "../interfaces/product.interface";

const initialState = {
  items: [] as Product[],
};

export const getAllInCategory = createAsyncThunk(
  "item/getAllInCategory",
  async (params: { page: number; limit: number; categoryId: number }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${BASE_URL_API}/item?page=${params.page}&limit=${params.limit}&categoryId=${params.categoryId}`,
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
    }
  },
);
export const getAll = createAsyncThunk(
  "item/getAll",
  async (params: { page: number; limit: number }) => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${BASE_URL_API}/item?page=${params.page}&limit=${params.limit}`,
      );

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
    }
  },
);

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllInCategory.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.items = action.payload.rows;
    });
    builder.addCase(getAll.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.items = action.payload.rows;
    });
  },
});

export default itemSlice.reducer;
export const userActions = itemSlice.actions;
