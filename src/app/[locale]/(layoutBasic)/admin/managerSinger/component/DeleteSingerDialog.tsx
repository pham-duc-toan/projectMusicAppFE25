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
import { useTranslations } from "next-intl";

interface DeleteSingerDialogProps {
  singerId: string;
}

const DeleteSingerDialog: React.FC<DeleteSingerDialogProps> = ({
  singerId,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppContext();
  const t = useTranslations("deleteSingerDialog");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient("DELETE", `/singers/${singerId}`);
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        showMessage(t("successMessage"), "success");
        await revalidateByTag("revalidate-tag-singers");
      }
    } catch (error) {
      console.error("Failed to delete singer:", error);
      showMessage(t("errorMessage"), "error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="primary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("confirmationText")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            {t("cancelButton")}
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            disabled={loading}
            variant="contained"
          >
            {loading ? t("deleting") : t("deleteButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteSingerDialog;
