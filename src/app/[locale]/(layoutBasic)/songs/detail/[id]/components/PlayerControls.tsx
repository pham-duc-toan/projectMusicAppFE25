"use client";

import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { play, pause, setNewSong } from "@/store/playingMusicSlice";

import IconButton from "@mui/material/IconButton";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

interface PlayerControlsProps {
  songDetail: {
    _id: string;
    title: string;
    avatar: string;
  };
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ songDetail }) => {
  const dispatch = useDispatch();
  const songCurrent = useSelector((state: RootState) => state.playingMusic);
  const isPlaying = useSelector(
    (state: RootState) => state.playingMusic.isPlaying
  );

  const handlePlayPauseClick = () => {
    if (isPlaying && songCurrent?._id === songDetail._id) {
      dispatch(pause());
    } else {
      dispatch(setNewSong(songDetail as any));
      dispatch(play());
    }
  };

  return (
    <IconButton color="primary" onClick={handlePlayPauseClick}>
      {isPlaying && songCurrent?._id === songDetail._id ? (
        <PauseIcon fontSize="large" />
      ) : (
        <PlayArrowIcon fontSize="large" />
      )}
    </IconButton>
  );
};

export default PlayerControls;
