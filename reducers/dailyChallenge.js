import { createSlice } from '@reduxjs/toolkit';

// TODO Complete reducer (Do not use value:... in reducers initial state!)
const initialState = null;

export const dailyChallengeSlice = createSlice({
  name: 'dailyChallenge',
  initialState,
  reducers: {
    setDailyChallenge: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setDailyChallenge } = dailyChallengeSlice.actions;
export default dailyChallengeSlice.reducer;
