"use client";
import React, { useEffect, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  Box,
  Collapse,
  CircularProgress,
} from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { apiBasicClient, getInfoUser } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { decodeToken } from "@/app/helper/jwt";

import { revalidateByTag } from "@/app/action";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  exitPlaylist,
  updateNewPlaylist,
} from "@/app/utils/updateCurrentPLayList";
import IUserInfo from "@/dataType/infoUser";

interface Playlist {
  _id: string;
  title: string;
  listSong: Array<{ _id: string }>;
  [key: string]: any;
}

// Giới hạn chiều cao của danh sách playlist và thêm thanh cuộn nếu cần
const PlaylistList = styled(List)({
  maxHeight: "300px",
  overflowY: "auto",
});

interface IconAddToPlayListProps {
  songId: string;
  fSongs: string[];
}

const IconAddToPlayList: React.FC<IconAddToPlayListProps> = ({
  songId,
  fSongs,
}) => {
  const access_token = getAccessTokenFromLocalStorage();
  const info_user = decodeToken(access_token || undefined);
  const dispatch = useDispatch();
  const currentPlaylist = useSelector((state: RootState) => state.playlist);
  const { showMessage } = useAppContext();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [infoUser, setInfoUser] = useState<IUserInfo | undefined>(undefined);
  // useEffect(() => {
  //   const fetchInfoUser = async () => {
  //     const infoUserData = await getInfoUser(access_token);
  //     setInfoUser(infoUserData);
  //   };
  //   fetchInfoUser();
  // }, []);
  const fetchPlaylists = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await apiBasicClient(
        "GET",
        "/playlists/detail",
        undefined,
        undefined
      );
      if (response?.data) {
        setPlaylists(response.data); // Cập nhật danh sách playlist từ API
      }
    } catch (error) {
      showMessage("Lỗi khi lấy danh sách playlist:", "error");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleClickOpen = async () => {
    if (!fSongs || !fSongs.some((song: any) => song === songId)) {
      showMessage(
        "Bài hát này không có trong danh sách bài hát yêu thích của bạn",
        "error"
      );
      return;
    }

    await fetchPlaylists();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsCreatingNew(false);
  };

  const handleAddNewPlaylist = async () => {
    if (newPlaylistTitle.trim() === "") return; // Không thêm nếu tiêu đề trống

    try {
      const response = await apiBasicClient("POST", "/playlists", undefined, {
        //@ts-ignore
        userId: info_user?._id,
        title: newPlaylistTitle,
      });

      if (response?.data) {
        setPlaylists([...playlists, response.data]);

        showMessage("Đã tạo playlist mới thành công", "success");
      } else {
        showMessage("Lỗi khi tạo playlist", "error");
      }
    } catch (error) {
      showMessage("Có lỗi xảy ra khi gọi API", "error");
    } finally {
      setNewPlaylistTitle("");
      setIsCreatingNew(false);
    }
  };

  // Xử lý khi nhấn Cancel
  const handleCancelCreate = () => {
    setIsCreatingNew(false); // Ẩn form tạo mới
    setNewPlaylistTitle(""); // Xóa nội dung input
  };

  // Xử lý khi nhấn Lưu
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setLoading(true); // Bắt đầu loading khi nhấn "Lưu"

    // Lấy các phần tử từ form
    const form = e.currentTarget;

    for (const playlist of playlists) {
      //@ts-ignore
      const isChecked = form.elements[playlist._id]?.checked;
      const wasChecked = playlist.listSong.some((song) => song._id === songId);

      // Gọi API dựa trên trạng thái checkbox
      if (isChecked != wasChecked) {
        if (isChecked) {
          const data = await apiBasicClient(
            "POST",
            `/playlists/addSong/${playlist._id}`,
            undefined,
            { idSong: songId }
          );
          if (data.statusCode >= 300 && data?.message) {
            showMessage(`${data.message}`, "error");
          } else {
            showMessage(`Thành công!`, "success");
          }
        } else {
          const data = await apiBasicClient(
            "DELETE",
            `/playlists/removeSong/${playlist._id}`,
            undefined,
            { idSong: songId }
          );
          if (data.statusCode >= 300 && data?.message) {
            showMessage(`${data.message}`, "error");
          } else {
            showMessage(`Thành công!`, "success");
          }
        }
      }
    }

    // Gọi revalidation sau khi hoàn tất
    revalidateByTag("revalidate-tag-list-playlist");
    //CALL API
    if (currentPlaylist._id) {
      const res = await apiBasicClient(
        "GET",
        `/playlists/findOne/${currentPlaylist._id}`
      );
      updateNewPlaylist(res.data, dispatch);
    }

    setLoading(false); // Kết thúc loading sau khi hoàn tất gọi API
    handleClose(); // Đóng modal sau khi lưu
  };

  // Xử lý khi xóa playlist
  const handleDeletePlaylist = async (playlistId: string) => {
    const res = await apiBasicClient("DELETE", `/playlists/${playlistId}`);
    if (playlistId == currentPlaylist._id) exitPlaylist(dispatch);
    revalidateByTag("revalidate-tag-list-playlist");

    if (res.data) {
      showMessage("Đã xóa thành công", "success");
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist._id !== playlistId)
      );
    }
  };

  return (
    <>
      {loading ? (
        <CircularProgress size={20} sx={{ margin: "0 8px" }} />
      ) : (
        <IconButton onClick={handleClickOpen}>
          <QueueIcon sx={{ fontSize: "20px" }} />
        </IconButton>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chọn playlist để thêm bài hát</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            {" "}
            {/* Bọc các ô checkbox trong thẻ form */}
            {/* Danh sách các playlist */}
            <PlaylistList>
              {playlists.map((playlist) => {
                const labelId = `checkbox-list-label-${playlist._id}`;

                return (
                  <ListItem key={playlist._id} button>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        defaultChecked={playlist.listSong.some(
                          (song) => song._id === songId
                        )}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        name={playlist._id} // Đặt tên cho checkbox để lấy giá trị
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={playlist.title} />

                    {/* Nút xóa playlist */}
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeletePlaylist(playlist._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                );
              })}

              {/* Nút tạo playlist mới */}
              {!isCreatingNew && (
                <ListItem button onClick={() => setIsCreatingNew(true)}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tạo danh sách phát mới" />
                </ListItem>
              )}

              {/* Form thêm playlist mới */}
              <Collapse in={isCreatingNew}>
                <Box mt={1} mb={2} display="flex" alignItems="center">
                  <TextField
                    label="Tên playlist mới"
                    fullWidth
                    value={newPlaylistTitle}
                    onChange={(e) => setNewPlaylistTitle(e.target.value)} // Cập nhật giá trị tiêu đề
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNewPlaylist}
                    sx={{ ml: 1 }}
                  >
                    Thêm
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCancelCreate}
                    sx={{ ml: 1 }}
                  >
                    Hủy
                  </Button>
                </Box>
              </Collapse>
            </PlaylistList>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Hủy
              </Button>
              <Button type="submit" color="primary">
                {" "}
                {/* Đặt type là submit để gọi handleSave */}
                {loading ? <CircularProgress size={20} /> : "Lưu"}{" "}
                {/* Hiển thị loading nếu đang chờ API */}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconAddToPlayList;
