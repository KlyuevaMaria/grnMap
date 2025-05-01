import { createSlice } from "@reduxjs/toolkit";
import { fetchAllAppeals, replyToAppeal } from "./appealAdminThunks";

const adminAppealsSlice = createSlice({
  name: "adminAppeals",
  initialState: {
    appeals: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppeals.fulfilled, (state, action) => {
        state.loading = false;
        state.appeals = action.payload;
      })
      .addCase(fetchAllAppeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(replyToAppeal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(replyToAppeal.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Ответ успешно отправлен!";
        // Можно тут же обновить локально обращение, если нужно
        const index = state.appeals.findIndex(a => a.id === action.payload.appealId);
        if (index !== -1) {
          state.appeals[index].reply = action.payload.replyMessage;
        }
      })
      .addCase(replyToAppeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminAppealsSlice.reducer;
