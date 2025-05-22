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
import { useTranslations } from "next-intl";

interface Playlist {
  id: string;
  title: string;
  listSong: Array<{ id: string }>;
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

  const t = useTranslations("PlaylistComponent");

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient(
        "GET",
        "/playlists/detail",
        undefined,
        undefined
      );
      if (response?.data) {
        if (response?.data) {
          const playlistsWithListSong = response.data.map((playlist: any) => ({
            ...playlist,
            listSong: Array.isArray(playlist.listSong) ? playlist.listSong : [],
          }));
          setPlaylists(playlistsWithListSong);
        }
      }
    } catch (error) {
      showMessage(t("fetchError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = async () => {
    if (!fSongs || !fSongs.some((song: any) => song === songId)) {
      showMessage(t("songNotInFavorites"), "error");
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
    if (newPlaylistTitle.trim() === "") return;

    try {
      const response = await apiBasicClient("POST", "/playlists", undefined, {
        //@ts-ignore
        userId: info_user?.id,
        title: newPlaylistTitle,
      });

      if (response?.data) {
        const dataProcessed = {
          ...response.data,
          listSong: Array.isArray(response.data.listSong)
            ? response.data.listSong
            : [],
        };
        setPlaylists([...playlists, dataProcessed]);
        showMessage(t("createSuccess"), "success");
      } else {
        showMessage(t("createError"), "error");
      }
    } catch (error) {
      showMessage(t("apiError"), "error");
    } finally {
      setNewPlaylistTitle("");
      setIsCreatingNew(false);
    }
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewPlaylistTitle("");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    for (const playlist of playlists) {
      //@ts-ignore
      const isChecked = form.elements[playlist.id]?.checked;
      const wasChecked = playlist.listSong.some((song) => song.id === songId);

      if (isChecked != wasChecked) {
        if (isChecked) {
          const data = await apiBasicClient(
            "POST",
            `/playlists/addSong/${playlist.id}`,
            undefined,
            {
              idSong: songId,
            }
          );
          if (data.statusCode >= 300 && data?.message) {
            showMessage(data.message, "error");
          } else {
            showMessage(t("addSuccess"), "success");
          }
        } else {
          const data = await apiBasicClient(
            "DELETE",
            `/playlists/removeSong/${playlist.id}`,
            undefined,
            {
              idSong: songId,
            }
          );
          if (data.statusCode >= 300 && data?.message) {
            showMessage(data.message, "error");
          } else {
            showMessage(t("removeSuccess"), "success");
          }
        }
      }
    }

    revalidateByTag("revalidate-tag-list-playlist");

    if (currentPlaylist.id) {
      const res = await apiBasicClient(
        "GET",
        `/playlists/findOne/${currentPlaylist.id}`
      );
      updateNewPlaylist(res.data, dispatch);
    }

    setLoading(false);
    handleClose();
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    const res = await apiBasicClient("DELETE", `/playlists/${playlistId}`);
    if (playlistId == currentPlaylist.id) exitPlaylist(dispatch);
    revalidateByTag("revalidate-tag-list-playlist");

    if (res.data) {
      showMessage(t("deleteSuccess"), "success");
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.id !== playlistId)
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
        <DialogTitle>{t("selectPlaylist")}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            {/* Danh sách các playlist */}
            <PlaylistList>
              {playlists.map((playlist) => {
                const labelId = `checkbox-list-label-${playlist.id}`;

                return (
                  <ListItem key={playlist.id} button>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        defaultChecked={playlist.listSong.some(
                          (song) => song.id === songId
                        )}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        name={playlist.id} // Đặt tên cho checkbox để lấy giá trị
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={playlist.title} />

                    {/* Nút xóa playlist */}
                    <IconButton
                      edge="end"
                      aria-label={t("delete")}
                      onClick={() => handleDeletePlaylist(playlist.id)}
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
                  <ListItemText primary={t("createNewPlaylist")} />
                </ListItem>
              )}

              {/* Form thêm playlist mới */}
              <Collapse in={isCreatingNew}>
                <Box mt={1} mb={2} display="flex" alignItems="center">
                  <TextField
                    label={t("newPlaylistName")}
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
                    {t("add")}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCancelCreate}
                    sx={{ ml: 1 }}
                  >
                    {t("cancel")}
                  </Button>
                </Box>
              </Collapse>
            </PlaylistList>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                {t("cancel")}
              </Button>
              <Button type="submit" color="primary">
                {loading ? <CircularProgress size={20} /> : t("save")}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IconAddToPlayList;
