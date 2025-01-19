"use client";
import React from "react";

import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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

const SingerInfoPopover: React.FC<SingerInfoPopoverProps> = ({ singer }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<"top" | "bottom">("bottom");
  const t = useTranslations("SingerInfoPopover");

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
        variant="subtitle1"
        color="text.secondary"
        sx={{ cursor: "pointer" }}
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <Link href={`/singers/detailSinger/${singer.slug}`}>
          {t("label")}: {singer?.fullName || t("unknownSinger")}
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
            <strong>{t("joinedDate")}:</strong>{" "}
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

export default SingerInfoPopover;
