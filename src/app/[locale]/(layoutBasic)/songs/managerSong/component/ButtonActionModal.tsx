"use client";
import React, { useState } from "react";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";

import EditSongModal from "./EditSongModal";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Topic {
  id: string;
  title: string;
}

interface Singer {
  fullName: string;
}

interface Song {
  id: string;
  title: string;
  avatar: string;
  singer: Singer;
  slug: string;
  topic: Topic;
  status: string;
}

interface ButtonActionModalProps {
  song: Song;
}

const ButtonActionModal: React.FC<ButtonActionModalProps> = ({ song }) => {
  const { showMessage } = useAppContext();
  const t = useTranslations("songActions");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gọi API

  const handleDelete = async () => {
    setIsLoading(true); // Bắt đầu gọi API, set loading = true
    try {
      const response = await apiBasicClient(
        "DELETE",
        `/songs/deleteSong/${song.id}`
      );
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        await revalidateByTag("revalidate-tag-songs");
        showMessage(t("deleteSuccess"), "success");
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error deleting song:", error);
    } finally {
      setIsLoading(false); // Kết thúc gọi API, set loading = false
    }
  };

  return (
    <>
      <Tooltip title={t("viewDetails")} arrow>
        <Link href={`/songs/detail/${song.slug}`}>
          <IconButton color="primary" disabled={isLoading}>
            <VisibilityIcon />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip title={t("edit")} arrow>
        <IconButton
          color="primary"
          onClick={() => setOpenEditModal(true)}
          disabled={isLoading}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("delete")} arrow>
        <IconButton
          color="primary"
          onClick={() => setOpenDialog(true)}
          disabled={isLoading}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      {/* Edit Song Modal */}
      <EditSongModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        song={song}
      />

      {/* Dialog xác nhận xóa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>{t("deletePrompt")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
            disabled={isLoading}
          >
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ButtonActionModal;
