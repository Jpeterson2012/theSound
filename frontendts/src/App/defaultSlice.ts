import { createSlice } from '@reduxjs/toolkit';

const defaultSlice = createSlice({
  name: 'defaultState',
  initialState: {
    authToken: null,
    refreshToken: null,
    playing: false,
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
  },
});

export const { setAuthToken, setRefreshToken, setPlaying } = defaultSlice.actions;
export default defaultSlice.reducer;