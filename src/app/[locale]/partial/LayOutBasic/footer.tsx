import { useHasMounted } from "@/app/utils/customHook";

import { TSongDetail } from "@/dataType/song";

import {
  pause,
  play,
  setCurrentTime,
  setNewSong,
} from "@/store/playingMusicSlice";
import { AppDispatch, RootState } from "@/store/store";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import styled from "@mui/system/styled";

import { useEffect, useRef } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import { useDispatch, useSelector } from "react-redux";

import DivNavigation from "./component/footerComponent";

import { apiBasicClientPublic } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";

import RightSlider from "./component/siderPlayList";

const StyledAudioPlayer = styled(H5AudioPlayer)(({ theme }) => ({
  "& .rhap_time": {
    color: theme.palette.text.primary,
  },
  "& .rhap_repeat-button": {
    color: theme.palette.text.primary,
  },
  "& .rhap_progress-indicator": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.text.primary,
  },
  "& .rhap_main-controls": {
    flex: "2 auto",
  },
  "& .rhap_main-controls-button": {
    color: theme.palette.text.primary,
  },
  "& .rhap_volume-button": {
    color: theme.palette.text.primary,
  },
  "& .rhap_progress-filled": {
    backgroundColor: theme.palette.text.primary,
  },
  "& .rhap_volume-indicator": {
    backgroundColor: theme.palette.text.primary,
  },
  "& .rhap_controls-section": {
    display: "flex",
    flex: "1 1 auto",

    alignItems: "center",
  },
  "& .rhap_additional-controls": {
    display: "flex",
    flex: "0",
    marginLeft: "20px",
    alignItems: "center",
  },
  "& .rhap_volume-controls": {
    flex: "1 auto",
  },
}));

const FooterComponent = () => {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const songCurrent = useSelector((state: RootState) => state.playingMusic);
  const currentPlaylist = useSelector((state: RootState) => state.playlist);

  const playerRef = useRef<H5AudioPlayer | null>(null);
  const mounted = useHasMounted();
  useEffect(() => {
    const audioElement = playerRef.current?.audio.current;
    let interval: NodeJS.Timeout | null = null;
    if (audioElement) {
      const handleCanPlay = () => {
        if (songCurrent.isPlaying) {
          audioElement.play().catch((error) => {
            console.log("Error playing audio:", error);
          });
        } else {
          audioElement.pause();
        }
      };

      const handleEnded = () => {
        const currentIndex = currentPlaylist.listSong.findIndex(
          (song) => song.id === songCurrent.id
        );

        let nextSong = undefined;
        if (currentPlaylist.isLooping) {
          const nextIndex =
            (currentIndex + 1) % currentPlaylist.listSong.length;
          nextSong = currentPlaylist.listSong[nextIndex];
        } else {
          const nextIndex = currentIndex + 1;
          if (nextIndex < currentPlaylist.listSong.length) {
            nextSong = currentPlaylist.listSong[nextIndex];
          }
        }

        if (nextSong) {
          dispatch(setNewSong(nextSong as TSongDetail)); // Cập nhật bài hát mới
          audioElement.src = nextSong.audio; // Cập nhật src
          audioElement.play().catch((error) => {
            console.log("Error playing next audio:", error);
          });
        } else {
          dispatch(pause());
        }
      };
      const handleTimeUpdate2 = async () => {
        const eightyPercentTime = Math.round(audioElement!.duration * 0.8);
        const currentTime = Math.round(audioElement!.currentTime);

        // console.log(currentTime, eightyPercentTime);

        // Kiểm tra nếu thời gian hiện tại đã đạt 80% thời lượng
        if (
          currentTime >= eightyPercentTime &&
          currentTime < eightyPercentTime + 1
        ) {
          console.log("this time!");
          try {
            await apiBasicClientPublic(
              "PATCH",
              `/songs/listen/increase/${songCurrent.id}`
            );

            clearInterval(interval!); // Ngừng kiểm tra sau khi đạt 80%
            await revalidateByTag("revalidate-tag-songs");
          } catch (error) {
            console.log("Lỗi khi tăng view:", error);
          }
        }
      };

      if (songCurrent.isPlaying && audioElement) {
        interval = setInterval(handleTimeUpdate2, 1000);
      }
      // Dừng interval khi bài hát dừng hoặc không còn phát
      if (!songCurrent.isPlaying && interval) {
        clearInterval(interval);
      }
      const handleTimeUpdate = () => {
        dispatch(setCurrentTime(audioElement.currentTime));
      };

      if (audioElement.currentSrc) handleCanPlay();
      audioElement.addEventListener("canplay", handleCanPlay);
      audioElement.addEventListener("ended", handleEnded);
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.removeEventListener("canplay", handleCanPlay);
        audioElement.removeEventListener("ended", handleEnded);
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
        if (interval) clearInterval(interval);
      };
    }
  }, [songCurrent.audio, songCurrent.isPlaying, currentPlaylist]);

  if (!mounted) {
    return null;
  }

  return (
    <footer
      className="footer"
      style={{
        display: "flex",
        flexDirection: "row",
        position: "fixed",
        top: "auto",
        bottom: "0",
        background: theme.palette.secondary.main,
        width: "100%",
        zIndex: "9999",
      }}
    >
      <RightSlider />
      <Container
        sx={{
          gap: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledAudioPlayer
          ref={playerRef}
          volume={1}
          style={{
            backgroundColor: theme.palette.secondary.main,
            boxShadow: "unset",
          }}
          layout="horizontal"
          src={songCurrent.audio}
          onPause={() => {
            dispatch(pause());
          }}
          onPlay={() => {
            dispatch(play());
          }}
          showJumpControls={false}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              opacity: "50%",
              fontSize: "15px",
            }}
          >
            {songCurrent.singerFullName}
          </div>

          {songCurrent?.slug && (
            <DivNavigation
              link={`/songs/detail/${songCurrent.slug}`}
              content={songCurrent.title}
            />
          )}
        </Box>
      </Container>
    </footer>
  );
};

export default FooterComponent;
