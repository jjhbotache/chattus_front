import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: "",
  reducers: {
    setRoom: (_, action) => {
      return action.payload;
    },
  },
});


export const { setRoom } = roomSlice.actions;
export default roomSlice.reducer;