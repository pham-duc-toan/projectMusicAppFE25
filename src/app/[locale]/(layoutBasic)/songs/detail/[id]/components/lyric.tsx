"use client";
import Typography from "@mui/material/Typography";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import parseLrc from "@/app/helper/parseLrc";
import { useEffect, useRef } from "react";

import "./style.css";

const Lyric = ({ songId, lyrics }: { songId: string; lyrics: string }) => {
  const currentSongId = useSelector(
    (state: RootState) => state.playingMusic.id
  );
  const currentTime = useSelector(
    (state: RootState) => state.playingMusic.currentTime
  );

  // Chuyển đổi chuỗi LRC thành mảng đối tượng { time, text }
  const parsedLyrics = parseLrc(lyrics);

  // Dùng ref để tự động cuộn đến lời bài hát được bôi đậm
  const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Tìm dòng lyric.time lớn nhất mà nhỏ hơn hoặc bằng currentTime
  const currentLyricIndex = parsedLyrics.reduce(
    (highestIndex, lyric, index) => {
      return lyric.time <= currentTime &&
        (highestIndex === -1 || lyric.time > parsedLyrics[highestIndex].time)
        ? index
        : highestIndex;
    },
    -1
  );

  useEffect(() => {
    // Chỉ cuộn nếu songId khớp với currentSongId
    if (
      songId === currentSongId &&
      currentLyricIndex !== -1 &&
      lyricRefs.current[currentLyricIndex]
    ) {
      lyricRefs.current[currentLyricIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center", // Giữ dòng lời bài hát bôi đậm ở giữa màn hình
      });
    }
  }, [currentLyricIndex, songId, currentSongId]);

  return (
    <>
      {parsedLyrics.length > 0 ? (
        parsedLyrics.map((lyric, index) => (
          //@ts-ignore
          <Typography
            key={index}
            variant="body2"
            whiteSpace="pre-line"
            //@ts-ignore
            ref={(el) => (lyricRefs.current[index] = el)} // Lưu ref cho từng dòng lời
            sx={{
              fontWeight:
                index === currentLyricIndex && songId === currentSongId
                  ? "bold"
                  : "normal", // Bôi đậm nếu dòng hiện tại trùng với currentLyricIndex và songId
              color:
                index === currentLyricIndex && songId === currentSongId
                  ? "primary.main"
                  : "#1b0c35",
              transition: "font-weight 0.3s ease, color 0.3s ease",
            }}
          >
            {lyric.text}
          </Typography>
        ))
      ) : (
        <Typography variant="body2" color="#1b0c35">
          {lyrics}
        </Typography>
      )}
    </>
  );
};

export default Lyric;
