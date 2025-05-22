import { TSongDetail } from "@/dataType/song";
import { setNewSong } from "@/store/playingMusicSlice";
import { patchUpdate, updatePlaylist } from "@/store/playListSlice";
import { AppDispatch } from "@/store/store";

interface SongState {
  id: string;
  title: string;
  avatar: string;
  audio: string;
  singer: {
    id: string;
    fullName: string;
    [key: string]: any;
  };
  like: number;
  slug: string;
}

interface Playlist {
  title: string;
  listSong: Array<SongState>;
  id: string;
  [key: string]: any;
}

// Hàm update toàn bộ playlist (như đã có)
export const updateNewPlaylist = (
  newPlaylist: Playlist,
  dispatch: AppDispatch
) => {
  const newPlaylistData = {
    id: newPlaylist.id,
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
    id: newPlaylist.id,
    title: newPlaylist.title,
    userId: newPlaylist.userId,
    listSong: newPlaylist.listSong,
    isLooping: false,
  };

  dispatch(updatePlaylist(newPlaylistData));
  dispatch(
    setNewSong(
      (newPlaylist.listSong[0] as TSongDetail) || {
        id: "",
        title: "",
        singer: {
          fullName: "",
          id: "",
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
    id: partialPlaylist.id,
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
    id: "",
    title: "",
    userId: "",
    listSong: [],
    isLooping: false,
  };

  dispatch(updatePlaylist(playlistData));
};
