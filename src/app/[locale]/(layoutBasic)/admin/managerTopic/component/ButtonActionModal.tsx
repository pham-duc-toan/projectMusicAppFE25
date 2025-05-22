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

import EditTopicModal from "./EditTopicModal";
import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import ViewTopicModal from "./VIewTopicModal";
import { useTranslations } from "next-intl";

interface Topic {
  id: string;
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
  const t = useTranslations("buttonActionModal");
  const { showMessage } = useAppContext();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient("DELETE", `/topics/${topic.id}`);
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        await revalidateByTag("revalidate-tag-topics");
        showMessage(t("messages.deleteSuccess"), "success");
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Tooltip title={t("tooltips.view")} arrow>
        <IconButton color="primary" onClick={() => setOpenViewModal(true)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("tooltips.edit")} arrow>
        <IconButton color="primary" onClick={() => setOpenEditModal(true)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("tooltips.delete")} arrow>
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
        <DialogTitle>{t("dialog.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>{t("dialog.confirmMessage")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            {t("dialog.cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? t("dialog.deleting") : t("dialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ButtonActionModal;
