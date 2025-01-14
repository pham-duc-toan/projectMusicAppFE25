"use client";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";

import {
  exitPlaylist,
  updateNewPlaylistAndRun,
  updateNewPlaylistPartial,
} from "@/app/utils/updateCurrentPLayList";

// Định nghĩa kiểu cho đối tượng playlist
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

interface PlaylistItemProps {
  playlist: Playlist;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist }) => {
  const dispatch = useDispatch();
  const currentPlaylist = useSelector((state: RootState) => state.playlist);
  const { showMessage } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(playlist.title);
  const open = Boolean(anchorEl);

  const handleClickPlayList = () => {
    updateNewPlaylistAndRun(playlist, dispatch);
  };
  const handleExitPlayList = () => {
    exitPlaylist(dispatch);
  };
  // Xử lý mở Menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng Menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Xử lý xóa playlist
  const handleDelete = async () => {
    handleMenuClose();
    setLoading(true);

    try {
      const response = await apiBasicClient(
        "DELETE",
        `/playlists/${playlist._id}`
      );

      if (response?.data) {
        revalidateByTag("revalidate-tag-list-playlist");
        if (playlist._id == currentPlaylist._id) handleExitPlayList();
        showMessage("Đã xóa playlist thành công", "success");
      } else {
        showMessage("Lỗi khi xóa playlist", "error");
      }
    } catch (error) {
      showMessage("Có lỗi xảy ra khi gọi API", "error");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở modal chỉnh sửa
  const handleEditClick = () => {
    setNewTitle(playlist.title);
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  // Xử lý submit khi nhấn "Sửa"
  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const response = await apiBasicClient(
        "PATCH",
        `/playlists/${playlist._id}`,
        undefined,
        { title: newTitle }
      );

      if (response?.data) {
        await revalidateByTag("revalidate-tag-list-playlist");
        showMessage("Đã sửa playlist thành công", "success");
        updateNewPlaylistPartial({ title: newTitle }, dispatch);
      } else {
        showMessage("Lỗi khi sửa playlist", "error");
      }
    } catch (error) {
      showMessage("Có lỗi xảy ra khi gọi API", "error");
    } finally {
      setIsEditModalOpen(false);
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        position: "relative",
      }}
    >
      {/* Nút Icon Menu (3 chấm dọc hoặc Loading khi đang xóa) */}
      <IconButton
        aria-label="menu"
        onClick={handleMenuClick}
        disabled={loading}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        {loading ? <CircularProgress size={24} /> : <MoreVertIcon />}
      </IconButton>

      {/* Menu hiển thị các tùy chọn */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
        <MenuItem onClick={handleEditClick}>Chỉnh sửa</MenuItem>
      </Menu>

      {/* Box chứa ảnh, với overflow để giới hạn khung */}
      <Box
        sx={{
          position: "relative",
          width: 170, // Độ rộng khung hình ảnh
          height: 170,
          overflow: "hidden", // Cắt ảnh khi phóng to vượt quá khung
        }}
      >
        {/* Hình ảnh của playlist với hiệu ứng zoom khi hover */}
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: "100%",
            transition: "transform 0.5s ease", // Thêm transition cho smooth zoom
            "&:hover": {
              transform: "scale(1.2)", // Zoom ảnh khi hover
            },
          }}
          image="https://res.cloudinary.com/dsi9ercdo/image/upload/v1728369637/lxwaiiafcrcwqji0swn6.png"
          alt={playlist.title}
        />

        {/* Overlay hiển thị khi hover */}
        <Box
          onClick={
            currentPlaylist._id === playlist._id
              ? handleExitPlayList
              : handleClickPlayList
          }
          className="hover-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.5s ease",
            zIndex: 1,
            "&:hover": {
              opacity: 1, // Hiển thị overlay khi hover
            },
          }}
        >
          {currentPlaylist._id !== playlist._id ? (
            <PlayCircleIcon sx={{ fontSize: 48, color: "#fff" }} />
          ) : (
            <PauseCircleIcon sx={{ fontSize: 48, color: "#fff" }} />
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <CardContent sx={{ flex: "1 0 auto", padding: "32px 24px 0 24px" }}>
          <Typography
            component="div"
            variant="h5"
            height={"100px"}
            sx={{
              fontSize: "20px",
              lineHeight: "1.3",
              height: "78px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              wordWrap: "break-word",
            }}
          >
            {playlist.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            height={"50%"}
            noWrap
          >
            {playlist.listSong.length} bài hát
          </Typography>
        </CardContent>
      </Box>

      {/* Modal Chỉnh sửa Playlist */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="edit-playlist-modal"
        aria-describedby="edit-playlist-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chỉnh sửa Playlist
          </Typography>
          <TextField
            fullWidth
            label="Tên Playlist"
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ marginLeft: "10px" }} />
            ) : (
              <Button variant="contained" onClick={handleEditSubmit}>
                Sửa
              </Button>
            )}

            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
};

export default PlaylistItem;
