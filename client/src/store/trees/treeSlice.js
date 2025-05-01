import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConditions,
  fetchEnvironments,
  fetchSpecialNotes,
  fetchStatuses,
  fetchTreeById,
  fetchTrees,
  updateTreeById,
} from "./treeThunks";

const initialState = {
  list: [],
  current: null,
  conditions: [],
  environments: [],
  specialNotes: [],
  statuses: [],
  loading: false,
  loadingConditions: false,
  loadingEnvironments: false,
  loadingSpecialNotes: false,
  loadingStatuses: false,
  error: null,
};

const treeSlice = createSlice({
  name: "trees",
  initialState,
  reducers: {
    setTrees(state, action) {
      state.list = action.payload;
    },
    addTree(state, action) {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTreeById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(updateTreeById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(fetchConditions.pending, (state) => {
        state.loadingConditions = true;
        state.error = null;
      })
      .addCase(fetchConditions.fulfilled, (state, action) => {
        state.loadingConditions = false;
        state.conditions = action.payload;
      })
      .addCase(fetchConditions.rejected, (state, action) => {
        state.loadingConditions = false;
        state.error = action.payload;
      })
      .addCase(fetchEnvironments.pending, (state) => {
        state.loadingEnvironments = true;
        state.error = null;
      })
      .addCase(fetchEnvironments.fulfilled, (state, action) => {
        state.loadingEnvironments = false;
        state.environments = action.payload;
      })
      .addCase(fetchSpecialNotes.pending, (state) => {
        state.loadingSpecialNotes = true;
        state.error = null;
      })
      .addCase(fetchSpecialNotes.fulfilled, (state, action) => {
        state.loadingSpecialNotes = false;
        state.specialNotes = action.payload;
      })
      .addCase(fetchStatuses.pending, (state) => {
        state.loadingStatuses = true;
        state.error = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loadingStatuses = false;
        state.statuses = action.payload;
      });
  },
});

export const { setTrees, addTree } = treeSlice.actions;
export default treeSlice.reducer;
