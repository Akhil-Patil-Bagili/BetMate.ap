import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '../../apiConfig';

// 1) Create an asyncThunk for searching users
export const searchUsers = createAsyncThunk(
  'search/searchUsers',
  async (query, {  rejectWithValue }) => {
    try {
      // Indicate loading started
     
      
      const response = await axios.get(`${API_ENDPOINTS.users}/search`, {
        params: { query },
        withCredentials: true,
      });
      // Return the data
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return rejectWithValue(error.response?.data || 'Search failed');
    } 
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    error: null,
  },
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.results = action.payload;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.results = [];
        state.error = action.payload || 'Error';
      });
  },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;
