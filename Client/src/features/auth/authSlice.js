import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  firstname:null,
  id:null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstname = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.firstname = null;
      state.id = null;
    },
  },
});

export const { setToken, setFirstName,setId,clearToken } = authSlice.actions;

export default authSlice.reducer;