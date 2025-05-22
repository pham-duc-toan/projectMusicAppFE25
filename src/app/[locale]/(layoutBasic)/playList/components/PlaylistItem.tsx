"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "@/store/store";

import {
  exitPlaylist,
  updateNewPlaylistAndRun,
  updateNewPlaylistPartial,
} from "@/app/utils/updateCurrentPLayList";

// Định nghĩa kiểu cho đối tượng playlist
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

interface PlaylistItemProps {
  playlist: Playlist;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist }) => {
  const t = useTranslations("Playlist");
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleMenuClose();
    setLoading(true);

    try {
      const response = await apiBasicClient(
        "DELETE",
        `/playlists/${playlist.id}`
      );

      if (response?.data) {
        revalidateByTag("revalidate-tag-list-playlist");
        if (playlist.id == currentPlaylist.id) handleExitPlayList();
        showMessage(t("messages.deleteSuccess"), "success");
      } else {
        showMessage(t("messages.deleteError"), "error");
      }
    } catch (error) {
      showMessage(t("messages.apiError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setNewTitle(playlist.title);
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      const response = await apiBasicClient(
        "PATCH",
        `/playlists/${playlist.id}`,
        undefined,
        { title: newTitle }
      );

      if (response?.data) {
        await revalidateByTag("revalidate-tag-list-playlist");
        showMessage(t("messages.editSuccess"), "success");
        updateNewPlaylistPartial({ title: newTitle }, dispatch);
      } else {
        showMessage(t("messages.editError"), "error");
      }
    } catch (error) {
      showMessage(t("messages.apiError"), "error");
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
      <IconButton
        aria-label="menu"
        onClick={handleMenuClick}
        disabled={loading}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        {loading ? <CircularProgress size={24} /> : <MoreVertIcon />}
      </IconButton>

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
        <MenuItem onClick={handleDelete}>{t("actions.delete")}</MenuItem>
        <MenuItem onClick={handleEditClick}>{t("actions.edit")}</MenuItem>
      </Menu>

      <Box
        sx={{
          position: "relative",
          width: 170,
          height: 170,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: "100%",
            transition: "transform 0.5s ease",
            "&:hover": {
              transform: "scale(1.2)",
            },
          }}
          image="https://res.cloudinary.com/dsi9ercdo/image/upload/v1728369637/lxwaiiafcrcwqji0swn6.png"
          alt={playlist.title}
        />

        <Box
          onClick={
            currentPlaylist.id === playlist.id
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
              opacity: 1,
            },
          }}
        >
          {currentPlaylist.id !== playlist.id ? (
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
            {playlist.listSong.length} {t("playlist.songs")}
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
            {t("playlist.editTitle")}
          </Typography>
          <TextField
            fullWidth
            label={t("playlist.name")}
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
                {t("playlist.edit")}
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditModalOpen(false)}
            >
              {t("buttons.cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
};

export default PlaylistItem;
