import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { challenge: null, lastUpdate: null },
};

export const dailyChallengeSlice = createSlice({
  name: 'dailyChallenge',
  initialState,
  reducers: {
    setDailyChallenge: (state, action) => {
      state.value.challenge = action.payload.challenge;
      state.value.lastUpdate = action.payload.lastUpdate;
    },
  },
});

export const { setDailyChallenge } = dailyChallengeSlice.actions;
export default dailyChallengeSlice.reducer;
