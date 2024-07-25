import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const canceledChallengesSlice = createSlice({
  name: 'canceledChallenges',
  initialState,
  reducers: {
    addAllCanceledChallenges: (state, action) => {
      return (state = action.payload);
    },
    addOneCanceledChallenge: (state, action) => {
      state.push(action.payload);
    },
    removeOneCanceledChallenge: (state, action) => {
      const index = state.findIndex(
        challenge => challenge._id === action.payload._id
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {
  addAllCanceledChallenges,
  addOneCanceledChallenge,
  removeOneCanceledChallenge,
} = canceledChallengesSlice.actions;
export default canceledChallengesSlice.reducer;
