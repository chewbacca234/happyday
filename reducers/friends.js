import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addAllFriends: (state, action) => {
      return (state = action.payload);
    },
    addOneFriend: (state, action) => {
      state.push(action.payload);
    },
    removeOneFriend: (state, action) => {
      const index = state.findIndex(friend => friend._id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const { addAllFriends, addOneFriend, removeOneFriend } =
  friendsSlice.actions;
export default friendsSlice.reducer;
