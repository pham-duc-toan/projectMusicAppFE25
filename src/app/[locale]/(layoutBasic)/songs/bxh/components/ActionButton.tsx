"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import PauseIcon from "@mui/icons-material/Pause";
import { Link } from "@/i18n/routing";
import { TSongDetail } from "@/dataType/song";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { pause, play, setNewSong } from "@/store/playingMusicSlice";
import Image from "next/image";
import IconAddToPlayList from "@/component/iconbutton/IconAddToPlayList";
import IconLikeSong from "@/component/iconbutton/IconLikeSong";

export default function ActionButton({
  fSongs,
  data,
}: {
  fSongs: string[];
  data: TSongDetail;
}) {
  const songCurrent = useSelector((state: RootState) => state.playingMusic);
  const dispatch: AppDispatch = useDispatch();
  const handleChangeNewSongPlaying = () => {
    dispatch(setNewSong(data));
  };
  const handleChangeIsPlaying = () => {
    if (songCurrent.isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
      {songCurrent._id != data._id ? (
        <IconButton aria-label="playing" onClick={handleChangeNewSongPlaying}>
          <PlayArrowIcon sx={{ fontSize: "24px" }} />
        </IconButton>
      ) : (
        <IconButton aria-label="play/pause" onClick={handleChangeIsPlaying}>
          {!songCurrent.isPlaying && songCurrent._id == data._id ? (
            <PlayArrowIcon sx={{ fontSize: "24px" }} />
          ) : (
            <PauseIcon sx={{ fontSize: "24px" }} />
          )}
        </IconButton>
      )}
      <IconAddToPlayList songId={data._id} fSongs={fSongs} />
      <IconLikeSong songId={data._id} fSongs={fSongs} />
    </Box>
  );
}
