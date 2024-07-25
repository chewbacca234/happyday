import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const inProgressBattlesSlice = createSlice({
  name: 'inProgressBattles',
  initialState,
  reducers: {
    addAllInProgressBattles: (state, action) => {
      return (state = action.payload);
    },
    addOneInProgressBattles: (state, action) => {
      state.push(action.payload);
    },
    removeOneInProgressBattles: (state, action) => {
      const index = state.findIndex(battle => battle._id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {
  addAllInProgressBattles,
  addOneInProgressBattles,
  removeOneInProgressBattles,
} = inProgressBattlesSlice.actions;
export default inProgressBattlesSlice.reducer;
