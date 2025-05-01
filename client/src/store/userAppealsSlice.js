import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "./axiosInstance";

// Async thunk для получения обращений пользователя
export const fetchUserAppeals = createAsyncThunk(
  "appeal/get-user-apeeals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/appeal/get-user-apeeals");
      console.log("responses:", response);

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Ошибка при получении обращений"
      );
    }
  }
);

const userAppealsSlice = createSlice({
  name: "userAppeals",
  initialState: {
    appeals: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addUserAppeal(state, action) {
      state.appeals.unshift(action.payload); // добавляем новое обращение
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAppeals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserAppeals.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Группируем обращения
        const groupedAppeals = {};
        action.payload.forEach((item) => {
          const id = item.id;
          if (!groupedAppeals[id]) {
            groupedAppeals[id] = {
              ...item,
              responses: [],
            };
          }
          if (item.response) {
            groupedAppeals[id].responses.push(item.response);
          }
        });
        state.appeals = Object.values(groupedAppeals);
      })
      .addCase(fetchUserAppeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userAppealsSlice.reducer;
export const { addUserAppeal } = userAppealsSlice.actions;
