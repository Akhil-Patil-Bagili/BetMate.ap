// friendSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setLoading } from './uiSlice';
import { API_ENDPOINTS } from '../../apiConfig';

// 1) Fetch betmates
export const fetchBetMates = createAsyncThunk(
  'friends/fetchBetMates',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${API_ENDPOINTS.friends}/list/${userId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch betmates');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// 2) Fetch pending requests
export const fetchPendingRequests = createAsyncThunk(
  'friends/fetchPendingRequests',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.friends}/pendingRequests`, {
        withCredentials: true
      });
      // Filter logic is also possible in the component,
      // but let's do it here for clarity
      const pending = response.data.filter(
        req => req.addresseeId === userId && req.status === 'pending'
      );
      return pending;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch pending requests');
    }
  }
);

// 3) Add betmate (send request)
export const addBetMateAsync = createAsyncThunk(
  'friends/addBetMate',
  async ({ requesterId, addresseeId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.friends}/sendRequest`, {
        requesterId,
        addresseeId
      }, { withCredentials: true });
      return { ...response.data, addresseeId };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to send friend request');
    }
  }
);

// 4) Remove betmate
export const removeBetMateAsync = createAsyncThunk(
  'friends/removeBetMate',
  async ({ userId, betMateId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_ENDPOINTS.friends}/removeBetmate/${betMateId}`, {
        withCredentials: true
      });
      return betMateId; // Return which betMate was removed
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to remove betmate');
    }
  }
);

// 5) Accept request
export const acceptRequestAsync = createAsyncThunk(
  'friends/acceptRequest',
  async ({ requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.friends}/acceptRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to accept friend request');
    }
  }
);

// 6) Decline request
export const declineRequestAsync = createAsyncThunk(
  'friends/declineRequest',
  async ({ requestId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.friends}/declineRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to decline friend request');
    }
  }
);

const friendSlice = createSlice({
  name: 'friends',
  initialState: {
    betMates: [],
    pendingRequests: [],
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBetMates
      .addCase(fetchBetMates.fulfilled, (state, action) => {
        state.betMates = action.payload.map(betMate => ({
          id: betMate.id,
          name: `${betMate.firstName} ${betMate.lastName}`,
          username: betMate.username
        }));
        state.error = null;
      })
      .addCase(fetchBetMates.rejected, (state, action) => {
        state.error = action.payload;
      })

      // fetchPendingRequests
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.error = action.payload;
      })

      // addBetMateAsync
      .addCase(addBetMateAsync.fulfilled, (state, action) => {
        // The user still needs to accept the request, so no immediate effect on betMates
        // But you might track requests you made, or do nothing here
        state.error = null;
      })
      .addCase(addBetMateAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // removeBetMateAsync
      .addCase(removeBetMateAsync.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.betMates = state.betMates.filter(bm => bm.id !== removedId);
        state.error = null;
      })
      .addCase(removeBetMateAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // acceptRequestAsync
      .addCase(acceptRequestAsync.fulfilled, (state) => {
        // Potentially re-fetch or do partial update.
        state.error = null;
      })
      .addCase(acceptRequestAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // declineRequestAsync
      .addCase(declineRequestAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(declineRequestAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default friendSlice.reducer;
