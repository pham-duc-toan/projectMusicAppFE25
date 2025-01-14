"use client";
import React, { useState } from "react";
import { Typography, Popover, Paper, Avatar, Box } from "@mui/material";
import { Link } from "@/i18n/routing";

interface TopicPopoverProps {
  topicDetail: {
    _id: string;
    title: string;
    avatar: string;
    description: string;
    status: string;
    slug: string;
    deleted: boolean;
  };
}

const TopicPopover: React.FC<TopicPopoverProps> = ({ topicDetail }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Link href={`/topics/detail/${topicDetail.slug}`}>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ cursor: "pointer" }}
          aria-owns={open ? "topic-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          Chủ đề: {topicDetail?.title || "Không rõ chủ đề"}
        </Typography>
      </Link>

      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: "none" }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Avatar
            src={topicDetail.avatar}
            alt={topicDetail.title}
            sx={{ width: 120, height: 120, marginBottom: "10px" }}
          />
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            {topicDetail.title}
          </Typography>

          <Typography
            sx={{
              marginBottom: "10px",
              fontSize: "14px",
              color: "text.secondary",
            }}
          >
            {topicDetail.description || "Không có mô tả"}
          </Typography>
        </Paper>
      </Popover>
    </>
  );
};

export default TopicPopover;
