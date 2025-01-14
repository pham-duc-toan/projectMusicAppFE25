"use client";

import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { revalidateByTag } from "@/app/action";

interface DeleteUserButtonProps {
  id: string;
  username: string;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({
  id,
  username,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppContext();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient("DELETE", `/users/${id}`);
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        await revalidateByTag("revalidate-tag-users"); // Làm mới dữ liệu
        showMessage(`Xóa người dùng "${username}" thành công!`, "success");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      showMessage("Đã xảy ra lỗi khi xóa người dùng.", "error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa người dùng <strong>{username}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteUserButton;
