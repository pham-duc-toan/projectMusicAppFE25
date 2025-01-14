"use client";
import React, { useState } from "react";
import {
  Typography,
  Popover,
  Paper,
  Avatar,
  Box,
  TableCell,
} from "@mui/material";
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

const CellTopicInfo: React.FC<TopicPopoverProps> = ({ topicDetail }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<"top" | "bottom">("bottom");

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Điều chỉnh vị trí Popover dựa trên vị trí TableCell
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
      <TableCell
        sx={{ cursor: "pointer" }}
        aria-owns={open ? "topic-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Link href={`/topics/detail/${topicDetail.slug}`}>
          {topicDetail?.title || "Không rõ chủ đề"}
        </Link>
      </TableCell>

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

export default CellTopicInfo;
