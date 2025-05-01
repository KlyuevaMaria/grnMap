import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

export const createAppeal = createAsyncThunk(
  "appeal/create-appeal",
  async (description, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/appeal/create-appeal", {
        description,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const appealsSlice = createSlice({
  name: "appeals",
  initialState: {
    items: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAppeal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAppeal.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
        state.successMessage = "Обращение успешно отправлено!";
      })
      .addCase(createAppeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ошибка при отправке";
      });
  },
});

export default appealsSlice.reducer;
