import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu cho trạng thái của bài hát
interface SongState {
  _id: string;
  title: string;
  avatar: string;
  audio: string;
  singerId: {
    _id: string;
    fullName: string;
    [key: string]: any;
  };
  like: number;
  slug: string;
}

// Định nghĩa kiểu cho trạng thái của playlist
interface PlayListState {
  _id: string;
  title: string;
  userId: string;
  listSong: SongState[];
  isLooping: boolean;
}

// Định nghĩa kiểu cho payload patchUpdate (có thể chỉ cập nhật một phần)
interface PatchPlayListPayload {
  _id?: string;
  title?: string;
  userId?: string;
  listSong?: SongState[];
  isLooping?: boolean;
}

// Khởi tạo trạng thái ban đầu cho playlist
const initialState: PlayListState = {
  _id: "",
  title: "",
  userId: "",
  listSong: [],
  isLooping: false,
};

// Tạo slice cho playlist
export const playlistSlice = createSlice({
  name: "playlist", // Tên slice
  initialState, // Trạng thái ban đầu
  reducers: {
    // Reducer để cập nhật toàn bộ trạng thái playlist
    updatePlaylist: (state, action: PayloadAction<PlayListState>) => {
      return { ...state, ...action.payload }; // Cập nhật trạng thái bằng cách kết hợp với payload mới
    },

    // Reducer để toggle giá trị isLooping
    toggleLooping: (state) => {
      state.isLooping = !state.isLooping; // Phủ định giá trị isLooping
    },

    // Reducer để cập nhật patch (chỉ update các trường có trong payload)
    patchUpdate: (state, action: PayloadAction<PatchPlayListPayload>) => {
      const { _id, title, userId, listSong, isLooping } = action.payload;

      if (_id !== undefined) state._id = _id;
      if (title !== undefined) state.title = title;
      if (userId !== undefined) state.userId = userId;
      if (listSong !== undefined) state.listSong = listSong;
      if (isLooping !== undefined) state.isLooping = isLooping;
    },
  },
});

// Export action để sử dụng trong component
export const { updatePlaylist, toggleLooping, patchUpdate } =
  playlistSlice.actions;

// Export reducer để thêm vào store
export default playlistSlice.reducer;
