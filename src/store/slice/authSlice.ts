import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    mobile: string;
    [key: string]: any;
  } | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ mobile: string }>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    setUserData: (state, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, setUserData } = authSlice.actions;
export default authSlice.reducer;
