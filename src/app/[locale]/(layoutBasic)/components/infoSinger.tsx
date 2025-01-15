"use client";
import React, { useState } from "react";
import { Typography, Popover, Paper, Avatar, Box } from "@mui/material";
import { Link } from "@/i18n/routing";

interface SingerInfoPopoverProps {
  singer: {
    fullName: string;
    avatar: string;
    status: string;
    slug: string;
    deleted: boolean;
    updatedAt: string;
    createdAt: string;
  };
}

const SingerInfo: React.FC<SingerInfoPopoverProps> = ({ singer }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<"top" | "bottom">("bottom");

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Kiểm tra vị trí để hiển thị Popover
    if (rect.bottom + 300 > viewportHeight) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }

    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          //combo hien thi 3 cham
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 1,
          overflow: "hidden",
          wordWrap: "break-word",
          cursor: "pointer",
        }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Link href={`/singers/detailSinger/${singer.slug}`}>
          Ca sĩ: {singer?.fullName || "Không rõ ca sĩ"}
        </Link>
      </Typography>

      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: position === "top" ? "top" : "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: position === "top" ? "bottom" : "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          <Avatar
            src={singer.avatar}
            alt={singer.fullName}
            sx={{ width: 120, height: 120, marginBottom: "10px" }}
          />
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            {singer.fullName}
          </Typography>

          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            <strong>Tham gia vào:</strong>{" "}
            {new Date(singer.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Typography>
        </Paper>
      </Popover>
    </>
  );
};

export default SingerInfo;
