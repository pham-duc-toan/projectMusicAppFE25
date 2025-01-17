"use client";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { apiBasicClient } from "@/app/utils/request";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { useEffect, useState } from "react";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import { useTranslations } from "next-intl";

export default function FavoriteButton({
  songId,
  fSongs,
}: {
  songId: string;
  fSongs: string[];
}) {
  const t = useTranslations("FavoriteButton");
  const [isFavorite, setIsFavorite] = useState(fSongs.includes(songId));
  const { showMessage } = useAppContext();

  useEffect(() => {
    setIsFavorite(fSongs.includes(songId));
  }, [fSongs, songId]);

  const handleFavoriteToggle = async () => {
    showMessage(t("processing"), "info");
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      try {
        if (isFavorite) {
          await apiBasicClient(
            "DELETE",
            `/songs/favoriteSongs/remove/${songId}`
          );
          await revalidateByTag("revalidate-tag-infoUser");
          await revalidateByTag("revalidate-tag-songs");
          setIsFavorite(false);
        } else {
          await apiBasicClient("POST", `/songs/favoriteSongs/add/${songId}`);
          await revalidateByTag("revalidate-tag-infoUser");
          await revalidateByTag("revalidate-tag-songs");
          setIsFavorite(true);
        }
        showMessage(t("success"), "success");
      } catch (error) {
        console.error(t("errorUpdatingFavorite"), error);
      }
    } else {
      showMessage(t("loginRequired"), "error");
    }
  };

  return (
    <IconButton onClick={handleFavoriteToggle}>
      {isFavorite ? (
        <FavoriteIcon sx={{ fontSize: "20px", color: "red" }} />
      ) : (
        <FavoriteBorderIcon sx={{ fontSize: "20px" }} />
      )}
    </IconButton>
  );
}
