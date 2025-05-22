"use client";
import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { TSongDetail } from "@/dataType/song";
import { Link } from "@/i18n/routing";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SingerInfo from "./infoSinger";

interface SliderProps {
  topSong: TSongDetail[];
}

const Slider: React.FC<SliderProps> = ({ topSong }) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md")); // Kiểm tra xem màn hình có nhỏ hơn md không
  const boxWidth = isMd ? 100 : 50; // Nếu màn hình nhỏ hơn md thì boxWidth = 100%, ngược lại là 50%

  const totalSlides = isMd ? topSong.length : topSong.length - 1;
  const [translateX, setTranslateX] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Hàm điều hướng slide
  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % totalSlides;
        return nextSlide;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    setTranslateX(currentSlide * boxWidth);
  }, [currentSlide, boxWidth]);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        marginBottom: "40px",
      }}
    >
      {/* Nút điều hướng bên trái */}
      <IconButton
        onClick={handlePrev}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "-15px",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "secondary.A100", // Màu nền nút
          borderRadius: "50%", // Hình tròn
          padding: "10px", // Kích thước nút
          "&:hover": {
            backgroundColor: "primary.main", // Màu nền khi hover
          },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* Nút điều hướng bên phải */}
      <IconButton
        onClick={handleNext}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          right: "-15px",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "secondary.A100", // Màu nền nút
          borderRadius: "50%", // Hình tròn
          padding: "10px", // Kích thước nút
          "&:hover": {
            backgroundColor: "primary.main", // Màu nền khi hover
          },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",

            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${translateX}%)`, // Chuyển động theo tỷ lệ phần trăm của box cha
          }}
        >
          {topSong.map((song: TSongDetail, index: number) => (
            <Box sx={{ flex: `0 0 ${boxWidth}%`, padding: "10px" }} key={index}>
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CardMedia
                  component="img"
                  image={song.avatar}
                  alt={song.title}
                  sx={{
                    margin: "10px",
                    marginLeft: "15px",
                    width: "120px",
                    aspectRatio: 1 / 1,
                    borderRadius: "8px",
                    marginRight: "20px",
                  }}
                />
                <Box
                  sx={{
                    padding: "5px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        lineHeight: 2,
                        overflow: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      <Link href={`/songs/detail/${song.slug}`}>
                        {song.title}
                      </Link>
                    </Typography>
                    <SingerInfo singer={song.singer} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        lineHeight: 2,
                        overflow: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      #{index + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: "10px",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        lineHeight: 2,
                        overflow: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      {new Date(song.createdAt).toLocaleDateString("en-GB")}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Slider;
