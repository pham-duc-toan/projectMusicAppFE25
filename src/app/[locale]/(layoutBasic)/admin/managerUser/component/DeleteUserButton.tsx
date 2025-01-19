"use client";

import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import DeleteIcon from "@mui/icons-material/Delete";

import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";

interface DeleteUserButtonProps {
  id: string;
  username: string;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({
  id,
  username,
}) => {
  const t = useTranslations("deleteUserButton");
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
        await revalidateByTag("revalidate-tag-users");
        showMessage(t("messages.success", { username }), "success");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      showMessage(t("messages.error"), "error");
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
        <DialogTitle>{t("dialog.title")}</DialogTitle>
        <DialogContent>
          {t("dialog.content")} <strong>{username}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {t("dialog.cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? t("dialog.deleting") : t("dialog.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteUserButton;
