import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user:{}
  // firstname:{},
  // id:null,
  // email:null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // setFirstName: (state, action) => {
    //   state.firstname = action.payload;
    // },
    // setId: (state, action) => {
    //   state.id = action.payload;
    // },
    // setEmail: (state, action) => {
    //   state.email = action.payload;
    // },
    clearToken: (state) => {
      state.token = null;
      state.user = {};
      // state.id = null;
    },
  },
});

export const { setToken, setUser,clearToken } = authSlice.actions;

export default authSlice.reducer;