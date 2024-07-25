import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const canceledBattlesSlice = createSlice({
  name: 'canceledBattles',
  initialState,
  reducers: {
    addAllCanceledBattles: (state, action) => {
      state = action.payload;
    },
    addOneCanceledBattle: (state, action) => {
      state.push(action.payload);
    },
    removeOneCanceledBattle: (state, action) => {
      const index = state.findIndex(battle => battle.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {
  addAllCanceledBattles,
  addOneCanceledBattle,
  removeOneCanceledBattle,
} = canceledBattlesSlice.actions;
export default canceledBattlesSlice.reducer;
