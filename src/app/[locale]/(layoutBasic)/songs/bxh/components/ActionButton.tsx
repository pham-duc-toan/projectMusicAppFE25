"use client";
import * as React from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import { TSongDetail } from "@/dataType/song";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { pause, play, setNewSong } from "@/store/playingMusicSlice";

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
      {songCurrent.id != data.id ? (
        <IconButton aria-label="playing" onClick={handleChangeNewSongPlaying}>
          <PlayArrowIcon sx={{ fontSize: "24px" }} />
        </IconButton>
      ) : (
        <IconButton aria-label="play/pause" onClick={handleChangeIsPlaying}>
          {!songCurrent.isPlaying && songCurrent.id == data.id ? (
            <PlayArrowIcon sx={{ fontSize: "24px" }} />
          ) : (
            <PauseIcon sx={{ fontSize: "24px" }} />
          )}
        </IconButton>
      )}
      <IconAddToPlayList songId={data.id} fSongs={fSongs} />
      <IconLikeSong songId={data.id} fSongs={fSongs} />
    </Box>
  );
}
