import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  fullName?: string;
  email?: string;
  mobile: string | null;
  boardId: string | null;
  classId: string | null;
  language: string | null;
  boardName?: string;
  className?: string;
}

const initialState: ProfileState = {
  fullName: '',
  email: '',
  mobile: null,
  boardId: null,
  classId: null,
  language: null,
  boardName: undefined,
  className: undefined,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileState>) {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.mobile = action.payload.mobile;
      state.boardId = action.payload.boardId;
      state.classId = action.payload.classId;
      state.language = action.payload.language;
    },

    clearProfile(state) {
      state.fullName = '';
      state.email = '';
      state.mobile = null;
      state.boardId = null;
      state.classId = null;
      state.language = null;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
