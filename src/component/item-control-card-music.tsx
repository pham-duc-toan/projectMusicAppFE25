"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import PauseIcon from "@mui/icons-material/Pause";
import { Link } from "@/i18n/routing";
import { TSongDetail } from "@/dataType/song";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { pause, play, setNewSong } from "@/store/playingMusicSlice";
import Image from "next/image";
import IconAddToPlayList from "./iconbutton/IconAddToPlayList";
import IconLikeSong from "./iconbutton/IconLikeSong";
import SingerInfoPopover from "./SingerInfoItem";

export default function ItemControlCard({
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
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <CardContent sx={{ flex: "1 0 auto", padding: "32px 24px 0 24px" }}>
          <Typography
            component="div"
            variant="h5"
            height={"100px"}
            sx={{
              fontSize: "20px",
              lineHeight: "1.3",
              height: "78px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              wordWrap: "break-word",
            }}
          >
            <Link href={`/songs/detail/${data.slug}`}>{data.title}</Link>
          </Typography>
          <SingerInfoPopover singer={data.singerId} />
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pb: 1 }}>
          {songCurrent._id != data._id ? (
            <IconButton
              aria-label="playing"
              onClick={handleChangeNewSongPlaying}
            >
              <PlayArrowIcon sx={{ fontSize: "48px" }} />
            </IconButton>
          ) : (
            <IconButton aria-label="play/pause" onClick={handleChangeIsPlaying}>
              {!songCurrent.isPlaying && songCurrent._id == data._id ? (
                <PlayArrowIcon sx={{ fontSize: "48px" }} />
              ) : (
                <PauseIcon sx={{ fontSize: "48px" }} />
              )}
            </IconButton>
          )}
          <IconAddToPlayList songId={data._id} fSongs={fSongs} />
          <IconLikeSong songId={data._id} fSongs={fSongs} />
        </Box>
      </Box>

      <Image
        src={data.avatar}
        alt={data.title}
        width={210}
        height={210}
        style={{ objectFit: "cover" }}
        priority
      />
    </Card>
  );
}
