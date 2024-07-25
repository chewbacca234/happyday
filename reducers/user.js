import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  avatar: null,
  picture: null,
  isAnonymous: true,
  score: null,
  level: { name: null, iconPath: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.avatar = action.payload.avatar;
      state.picture = action.payload.picture;
      state.score = action.payload.score;
      state.isAnonymous = action.payload.isAnonymous;
    },
    logout: state => {
      state.username = null;
      state.avatar = null;
      state.picture = null;
      state.score = null;
      state.level = { name: null, iconPath: null };
      state.isAnonymous = true;
    },
    setLevel: (state, action) => {
      state.level.name = action.payload.name;
      state.level.iconPath = action.payload.iconPath;
    },
    updateScoreAndLevel: (state, action) => {
      state.score = action.payload.score;
      state.level = action.payload.level;
    },
  },
});

export const { login, logout, setLevel, updateScoreAndLevel } =
  userSlice.actions;
export default userSlice.reducer;
