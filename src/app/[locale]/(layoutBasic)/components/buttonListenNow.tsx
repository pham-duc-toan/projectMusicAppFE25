"use client";
import React from "react";
import { Button } from "@mui/material";
import { TSongDetail } from "@/dataType/song"; // Import kiểu dữ liệu bài hát (thay thế đường dẫn đúng)
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { pause, play, setNewSong } from "@/store/playingMusicSlice";

interface ButtonListenNowProps {
  song: TSongDetail; // Tham số bài hát
}

const ButtonListenNow: React.FC<ButtonListenNowProps> = ({ song }) => {
  const dispatch = useDispatch();

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
      onClick={handlePlayPauseClick} // Gắn sự kiện click
    >
      Nghe Ngay
    </Button>
  );
};

export default ButtonListenNow;
