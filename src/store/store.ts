// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./playListSlice";
import playingMusicReducer from "./playingMusicSlice";
export const store = configureStore({
  reducer: {
    playingMusic: playingMusicReducer,
    playlist: playlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
