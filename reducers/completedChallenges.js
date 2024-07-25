import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const completedChallengesSlice = createSlice({
  name: 'completedChallenges',
  initialState,
  reducers: {
    addAllCompletedChallenges: (state, action) => {
      return (state = action.payload);
    },
    addOneCompletedChallenge: (state, action) => {
      state.push(action.payload);
    },
    removeOneCompletedChallenge: (state, action) => {
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
  addAllCompletedChallenges,
  addOneCompletedChallenge,
  removeOneCompletedChallenge,
} = completedChallengesSlice.actions;
export default completedChallengesSlice.reducer;
