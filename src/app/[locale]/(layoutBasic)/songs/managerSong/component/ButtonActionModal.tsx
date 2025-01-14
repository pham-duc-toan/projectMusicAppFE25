"use client";
import React, { useState } from "react";
import {
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import EditSongModal from "./EditSongModal";
import { Link } from "@/i18n/routing";

interface Topic {
  _id: string;
  title: string;
}

interface Singer {
  fullName: string;
}

interface Song {
  _id: string;
  title: string;
  avatar: string;
  singerId: Singer;
  slug: string;
  topicId: Topic;
  status: string;
}

interface ButtonActionModalProps {
  song: Song;
}

const ButtonActionModal: React.FC<ButtonActionModalProps> = ({ song }) => {
  const { showMessage } = useAppContext();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gọi API

  const handleDelete = async () => {
    setIsLoading(true); // Bắt đầu gọi API, set loading = true
    try {
      const response = await apiBasicClient(
        "DELETE",
        `/songs/deleteSong/${song._id}`
      );
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        await revalidateByTag("revalidate-tag-songs");
        showMessage("Xóa bài hát thành công!", "success");
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
      <Tooltip title="Xem chi tiết" arrow>
        <Link href={`/songs/detail/${song.slug}`}>
          <IconButton color="primary" disabled={isLoading}>
            <VisibilityIcon />
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip title="Chỉnh sửa" arrow>
        <IconButton
          color="primary"
          onClick={() => setOpenEditModal(true)}
          disabled={isLoading}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa bài hát" arrow>
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
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc muốn xóa bài hát này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="primary"
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
            disabled={isLoading}
          >
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ButtonActionModal;
