"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { pause, play, setNewSong } from "@/store/playingMusicSlice";
import { RootState } from "@/store/store";

interface PlayPauseButtonProps {
  song: any;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ song }) => {
  const dispatch = useDispatch();
  const { isPlaying, _id: playingSongId } = useSelector(
    (state: RootState) => state.playingMusic
  );

  const handlePlayPauseClick = () => {
    if (isPlaying && playingSongId === song._id) {
      dispatch(pause());
    } else {
      dispatch(setNewSong(song));
      dispatch(play());
    }
  };

  return (
    <IconButton color="primary" onClick={handlePlayPauseClick}>
      {isPlaying && playingSongId === song._id ? (
        <PauseIcon />
      ) : (
        <PlayArrowIcon />
      )}
    </IconButton>
  );
};

export default PlayPauseButton;
