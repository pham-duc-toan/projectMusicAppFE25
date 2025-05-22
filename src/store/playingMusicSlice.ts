import { TSongDetail, TSongFooter } from "@/dataType/song";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Khởi tạo state mặc định cho playingMusic với kiểu TSongFooter và thêm currentTime
const initialState: TSongFooter = {
  id: "",
  title: "",
  singerFullName: "",
  audio: "",
  slug: "",
  isPlaying: false,
  currentTime: 0, // Thêm currentTime vào initialState
};

const playingMusicSlice = createSlice({
  name: "playingMusic", // Đổi tên slice thành "playingMusic"
  initialState,
  reducers: {
    pause: (state) => {
      state.isPlaying = false;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    setNewSong: (state, action: PayloadAction<TSongDetail>) => {
      // Cập nhật thông tin bài hát từ TSongDetail
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.singerFullName = action.payload.singer?.fullName || "Unknow Singer";
      state.audio = action.payload.audio;
      state.slug = action.payload.slug;
      state.isPlaying = true; // Đặt trạng thái phát bài hát mới
      state.currentTime = 0; // Đặt lại currentTime khi thay đổi bài hát
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload; // Cập nhật currentTime
    },
  },
});

export const { pause, play, setNewSong, setCurrentTime } =
  playingMusicSlice.actions;
export default playingMusicSlice.reducer;
