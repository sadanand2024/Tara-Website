import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {}
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    storeUser(state, action) {
      //   const data = action.payload;
      console.log(action.payload);
      state.user = action.payload;
    }
  }
});

export default account.reducer;

export const { storeUser } = account.actions;
