import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const inProgressChallengesSlice = createSlice({
  name: 'completedChallenges',
  initialState,
  reducers: {
    addAllInProgressChallenges: (state, action) => {
      return (state = action.payload);
    },
    addOneInProgressChallenge: (state, action) => {
      state.push(action.payload);
    },
    removeOneInProgressChallenge: (state, action) => {
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
  addAllInProgressChallenges,
  addOneInProgressChallenge,
  removeOneInProgressChallenge,
} = inProgressChallengesSlice.actions;
export default inProgressChallengesSlice.reducer;
