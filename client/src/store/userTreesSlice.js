import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "./axiosInstance";

// Async thunk для получения деревьев пользователя
export const fetchUserTrees = createAsyncThunk(
  'tree/user-trees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/tree/user-trees', );
      console.log("💚", response);
      return response.data;
      
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка при получении деревьев');
    }
  }
);

const userTreesSlice = createSlice({
  name: 'userTrees',
  initialState: {
    trees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTrees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserTrees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trees = action.payload;
      })
      .addCase(fetchUserTrees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userTreesSlice.reducer;
