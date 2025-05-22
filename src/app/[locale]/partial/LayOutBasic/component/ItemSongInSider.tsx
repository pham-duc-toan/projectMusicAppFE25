"use client";
import React, { useState, MouseEvent } from "react";

import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { pause, play, setNewSong } from "@/store/playingMusicSlice";
import { TSongDetail } from "@/dataType/song";

import { useTheme } from "@emotion/react";
import { revalidateByTag } from "@/app/action";
import { apiBasicClient } from "@/app/utils/request";
import { updateNewPlaylist } from "@/app/utils/updateCurrentPLayList";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// Định nghĩa kiểu cho props của component
interface Song {
  id: string;
  title: string;
  avatar: string;
  slug: string;
  singer: {
    id: string;
    fullName: string;
    [key: string]: any;
  };
  audio: string;
}

interface ItemSongInSliderProps {
  song: Song;
  setIsOpen: any;
}

const ItemSongInSlider: React.FC<ItemSongInSliderProps> = ({
  song,
  setIsOpen,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslations("Button");
  const songCurrent = useSelector((state: RootState) => state.playingMusic);
  const currentPlaylist = useSelector((state: RootState) => state.playlist);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  // Hàm mở menu
  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Hàm đóng menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Hàm xử lý sự kiện xóa
  const handleDelete = async () => {
    setLoading(true);

    handleClose();
    const res1 = await apiBasicClient(
      "DELETE",
      `/playlists/removeSong/${currentPlaylist.id}`,
      undefined,
      { idSong: song.id }
    );

    revalidateByTag("revalidate-tag-list-playlist");
    //CALL API
    const res = await apiBasicClient(
      "GET",
      `/playlists/findOne/${currentPlaylist.id}`
    );
    updateNewPlaylist(res.data, dispatch);

    setLoading(false); // Kết thúc loading sau khi hoàn tất gọi API
    // Đóng modal sau khi lưu
  };

  //xu ly su kien song
  const handleChangeNewSongPlaying = () => {
    dispatch(setNewSong(song as TSongDetail));
  };
  const handleChangeIsPlaying = () => {
    if (songCurrent.isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  };
  return (
    <ListItem
      key={song.id}
      sx={{
        bgcolor:
          song.id === songCurrent.id
            ? //@ts-ignore
              theme.palette.secondary.A200
            : "inherit",
        boxShadow:
          //@ts-ignore
          theme.palette.mode === "dark"
            ? "0px 4px 15px rgba(255, 255, 255, 0.1)"
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
        marginBottom: "10px",
        borderRadius: "4px",
      }}
    >
      <ListItemAvatar>
        <Avatar src={song.avatar} alt={song.title} />
      </ListItemAvatar>
      <ListItemText
        primary={song.title}
        secondary={`Ca sĩ: ${song.singer?.fullName || "Không rõ ca sĩ"}`}
      />

      {/* Box để sắp xếp các nút theo hàng dọc */}
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Nút menu */}
        <IconButton onClick={handleMenuClick}>
          {loading ? <CircularProgress size={24} /> : <MoreVertIcon />}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            sx={{
              padding: "4px 8px", // Giảm padding
              minHeight: "30px", // Thiết lập chiều cao tối thiểu
              fontSize: "14px", // Giảm kích thước font
            }}
            onClick={handleDelete}
          >
            {t("Xoa")}
          </MenuItem>
          <MenuItem
            sx={{
              padding: "4px 8px", // Giảm padding
              minHeight: "30px", // Thiết lập chiều cao tối thiểu
              fontSize: "14px", // Giảm kích thước font
            }}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Link href={`/songs/detail/${song.slug}`}>{t("ChiTiet")}</Link>
          </MenuItem>
        </Menu>
        {/* Nút phát nhạc */}
        <IconButton
          onClick={
            song.id == songCurrent.id
              ? handleChangeIsPlaying
              : handleChangeNewSongPlaying
          }
        >
          {song.id == songCurrent.id && songCurrent.isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayArrowIcon />
          )}
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default ItemSongInSlider;
