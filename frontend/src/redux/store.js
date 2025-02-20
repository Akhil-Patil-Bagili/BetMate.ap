import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';
import friendReducer from './slices/friendSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    ui: uiReducer,
    friends: friendReducer,
  },
});
