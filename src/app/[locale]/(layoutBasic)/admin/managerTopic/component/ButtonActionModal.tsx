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

import EditTopicModal from "./EditTopicModal";
import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import ViewTopicModal from "./VIewTopicModal";

interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}

interface ButtonActionModalProps {
  topic: Topic;
}

const ButtonActionModal: React.FC<ButtonActionModalProps> = ({ topic }) => {
  const { showMessage } = useAppContext();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient("DELETE", `/topics/${topic._id}`);
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        await revalidateByTag("revalidate-tag-topics");
        showMessage("Xóa chủ đề thành công!", "success");
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip title="Xem chi tiết" arrow>
        <IconButton color="primary" onClick={() => setOpenViewModal(true)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Chỉnh sửa" arrow>
        <IconButton color="primary" onClick={() => setOpenEditModal(true)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Xóa chủ đề" arrow>
        <IconButton color="primary" onClick={() => setOpenDialog(true)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      {/* Modals */}
      <ViewTopicModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        topic={topic}
      />
      <EditTopicModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        topic={topic}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc muốn xóa chủ đề này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? "Đang xóa" : "Có"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ButtonActionModal;
