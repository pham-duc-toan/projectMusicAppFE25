import { TSongDetail } from "@/dataType/song";
import { setNewSong } from "@/store/playingMusicSlice";
import { patchUpdate, updatePlaylist } from "@/store/playListSlice";
import { AppDispatch } from "@/store/store";

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

interface Playlist {
  title: string;
  listSong: Array<SongState>;
  _id: string;
  [key: string]: any;
}

// Hàm update toàn bộ playlist (như đã có)
export const updateNewPlaylist = (
  newPlaylist: Playlist,
  dispatch: AppDispatch
) => {
  const newPlaylistData = {
    _id: newPlaylist._id,
    title: newPlaylist.title,
    userId: newPlaylist.userId,
    listSong: newPlaylist.listSong,
    isLooping: false,
  };

  dispatch(updatePlaylist(newPlaylistData));
};
export const updateNewPlaylistAndRun = (
  newPlaylist: Playlist,
  dispatch: AppDispatch
) => {
  const newPlaylistData = {
    _id: newPlaylist._id,
    title: newPlaylist.title,
    userId: newPlaylist.userId,
    listSong: newPlaylist.listSong,
    isLooping: false,
  };

  dispatch(updatePlaylist(newPlaylistData));
  dispatch(
    setNewSong(
      (newPlaylist.listSong[0] as TSongDetail) || {
        _id: "",
        title: "",
        singerId: {
          fullName: "",
          _id: "",
        },
        audio: "",
        slug: "",
        isPlaying: false,
      }
    )
  );
};
// Hàm update partial (chỉ cập nhật các trường được truyền vào)
export const updateNewPlaylistPartial = (
  partialPlaylist: Partial<Playlist>, // Partial cho phép cập nhật một phần
  dispatch: AppDispatch
) => {
  const partialPlaylistData = {
    _id: partialPlaylist._id,
    title: partialPlaylist.title,
    userId: partialPlaylist.userId,
    listSong: partialPlaylist.listSong,
    isLooping: partialPlaylist.isLooping,
  };

  dispatch(patchUpdate(partialPlaylistData)); // Dispatch hành động patchUpdate
};
export const exitPlaylist = (dispatch: AppDispatch) => {
  // Cập nhật Redux store với playlist đã xử lý
  const playlistData = {
    _id: "",
    title: "",
    userId: "",
    listSong: [],
    isLooping: false,
  };

  dispatch(updatePlaylist(playlistData));
};
