"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { revalidateByTag } from "@/app/action";

interface DeleteSingerDialogProps {
  singerId: string;
}

const DeleteSingerDialog: React.FC<DeleteSingerDialogProps> = ({
  singerId,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppContext();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient("DELETE", `/singers/${singerId}`);
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        showMessage("Xóa ca sĩ thành công!", "success");
        await revalidateByTag("revalidate-tag-singers"); // Revalidate dữ liệu
      }
    } catch (error) {
      console.error("Failed to delete singer:", error);
      showMessage("Đã xảy ra lỗi khi xóa ca sĩ.", "error");
    } finally {
      setLoading(false);
      setOpen(false); // Đóng dialog
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Xóa ca sĩ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa ca sĩ này? Thao tác này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            disabled={loading}
            variant="contained"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteSingerDialog;
