"use client";
import React from "react";

import Button from "@mui/material/Button";

import { TSongDetail } from "@/dataType/song";
import { useDispatch } from "react-redux";
import { play, setNewSong } from "@/store/playingMusicSlice";

import { useTranslations } from "next-intl";

interface ButtonListenNowProps {
  song: TSongDetail; // Tham số bài hát
}

const ButtonListenNow: React.FC<ButtonListenNowProps> = ({ song }) => {
  const dispatch = useDispatch();
  const t = useTranslations("ButtonListenNow");

  const handlePlayPauseClick = () => {
    dispatch(setNewSong(song as any));
    dispatch(play());
  };

  return (
    <Button
      sx={{
        transition: "all 0.3s ease-in-out",
        backgroundColor: "transparent",
        borderColor: "primary.main",
        color: "primary.main",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "primary.main",
          color: "white",
          borderColor: "primary.main",
        },
      }}
      variant="outlined"
      color="primary"
      onClick={handlePlayPauseClick}
    >
      {t("buttonText")}
    </Button>
  );
};

export default ButtonListenNow;
