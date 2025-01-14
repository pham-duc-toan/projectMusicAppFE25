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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết chủ đề</DialogTitle>
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
            <Typography variant="h6">Tên chủ đề:</Typography>
            <Typography>{topic.title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Mô tả:</Typography>
            <Typography>{topic.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Trạng thái:</Typography>
            <Typography>
              {topic.status === "active" ? "Hoạt động" : "Không hoạt động"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Slug:</Typography>
            <Typography>{topic.slug}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Button onClick={onClose} color="primary" sx={{ margin: 2 }}>
        Đóng
      </Button>
    </Dialog>
  );
};

export default ViewTopicModal;
