import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Avatar,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

interface ViewTopicModalProps {
  open: boolean;
  onClose: () => void;
  topic: {
    _id: string;
    title: string;
    avatar: string;
    description: string;
    status: string;
    slug: string;
  };
}

const ViewTopicModal: React.FC<ViewTopicModalProps> = ({
  open,
  onClose,
  topic,
}) => {
  const t = useTranslations("viewTopicModal");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("dialogTitle")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} textAlign="center">
            <Avatar
              src={topic.avatar}
              alt={topic.title}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{t("fields.title")}</Typography>
            <Typography>{topic.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{t("fields.description")}</Typography>
            <Typography>{topic.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{t("fields.status")}</Typography>
            <Typography>
              {topic.status === "active"
                ? t("fields.active")
                : t("fields.inactive")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{t("fields.slug")}</Typography>
            <Typography>{topic.slug}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Button onClick={onClose} color="primary" sx={{ margin: 2 }}>
        {t("buttons.close")}
      </Button>
    </Dialog>
  );
};

export default ViewTopicModal;
