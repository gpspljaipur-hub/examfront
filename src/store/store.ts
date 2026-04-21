import { configureStore } from '@reduxjs/toolkit';
import testReducer from './slice/testSlice';

export const store = configureStore({
  reducer: {
    test: testReducer,
  },
});

// ✅ ADD THIS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
