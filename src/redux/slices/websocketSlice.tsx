import { createSlice } from "@reduxjs/toolkit";

const websocketSlice = createSlice({
  name: 'websocket',
  initialState: null,
  reducers: {
    setWebsocket: (_, action) => {
      return action.payload;
    },
  },
});

export const { setWebsocket } = websocketSlice.actions;
export default websocketSlice.reducer;