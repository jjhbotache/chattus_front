import { configureStore } from "@reduxjs/toolkit";
import roomSlice from "./slices/roomSlice";
import websocketSlice from "./slices/websocketSlice";

const store = configureStore({
  reducer: {
    room:roomSlice,
    websocket: websocketSlice,
  }
})

export default store;