"use client";

import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";

import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";

interface SongForYouButtonProps {
  songId: string;
  initialForYou: boolean;
}

const SongForYouButton: React.FC<SongForYouButtonProps> = ({
  songId,
  initialForYou,
}) => {
  const t = useTranslations("songForYouButton");
  const { showMessage } = useAppContext();
  const [isForYou, setIsForYou] = useState(initialForYou);

  const handleClick = async () => {
    try {
      const endpoint = isForYou
        ? `/song-for-you/remove/${songId}`
        : `/song-for-you/add/${songId}`;
      const method = isForYou ? "DELETE" : "POST";
      const response = await apiBasicClient(method, endpoint);
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error"); // Giữ nguyên từ API
      } else {
        setIsForYou(!isForYou);
        await revalidateByTag("revalidate-tag-song-for-you");
        showMessage(
          isForYou ? t("messages.removed") : t("messages.added"),
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to toggle song for you", error);
    }
  };

  return (
    <IconButton onClick={handleClick}>
      {isForYou ? <StarIcon color="warning" /> : <StarBorderIcon />}
    </IconButton>
  );
};

export default SongForYouButton;
