import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const completedBattlesSlice = createSlice({
  name: 'completedBattles',
  initialState,
  reducers: {
    addAllCompletedBattles: (state, action) => {
      state = action.payload;
    },
    addOneCompletedBattle: (state, action) => {
      state.push(action.payload);
    },
    removeOneCompletedBattle: (state, action) => {
      const index = state.findIndex(battle => battle.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {
  addAllCompletedBattles,
  addOneCompletedBattle,
  removeOneCompletedBattle,
} = completedBattlesSlice.actions;
export default completedBattlesSlice.reducer;
