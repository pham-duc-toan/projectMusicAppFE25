"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { FileWithPath } from "react-dropzone";
import DropzoneComponent from "@/component/customDropzone/dropzoneComponent";
import { useAppContext } from "@/context-app";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import axios, { AxiosProgressEvent } from "axios";
import { revalidateByTag } from "@/app/action";
import { apiBasicClient } from "@/app/utils/request";

interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}

interface EditTopicModalProps {
  open: boolean;
  onClose: () => void;
  topic: Topic;
}

const EditTopicModal: React.FC<EditTopicModalProps> = ({
  open,
  onClose,
  topic,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("active");

  const { showMessage } = useAppContext();

  useEffect(() => {
    if (topic && open) {
      setAvatarPreview(topic.avatar || null);
      setStatus(topic.status || "active");
      setMounted(true);
    }
  }, [topic, open]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarFile(file);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = getAccessTokenFromLocalStorage();
    const form = e.currentTarget;
    //@ts-ignore
    const title = form.title.value || "";
    const description = form.description.value || "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    setLoading(true);
    try {
      const response = await axios.patchForm(
        process.env.NEXT_PUBLIC_BACK_END_URL + `/topics/editTopic/${topic._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total!);
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        const response = await apiBasicClient(
          "GET",
          "/topics",
          undefined,
          undefined
        );
        if (response.statusCode >= 300) {
          showMessage(response.message, "error");
        }
        await revalidateByTag("revalidate-tag-topics");
        if (response?.data) {
          showMessage("Chỉnh sửa thành công!", "success");
        }

        onClose();
      } else {
        showMessage(response.data.message || "Something went wrong", "error");
      }
    } catch (error: any) {
      showMessage(error.response?.data?.message || "Lỗi khi upload!", "error");
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value as string);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Topic</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} marginTop={"10px"}>
              <TextField
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                }}
                size="small"
                label="Title"
                name="title"
                defaultValue={topic.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  defaultValue={topic.status}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                defaultValue={topic.description || ""}
                label="Description"
                name="description"
                multiline
                minRows={4}
                maxRows={10}
              />
            </Grid>

            {/* Avatar Upload */}
            {avatarPreview && (
              <Grid xs={12} item>
                <Card
                  sx={{
                    maxWidth: "460px",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={avatarPreview}
                    alt="Avatar Preview"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography>Avatar Preview</Typography>
                  </CardContent>
                  <IconButton
                    onClick={handleRemoveAvatar}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: "red",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Card>
              </Grid>
            )}

            {!avatarPreview && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DropzoneComponent onDrop={onDrop} />
              </Grid>
            )}

            {loading && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LinearProgress
                  sx={{
                    width: "100px",
                  }}
                  variant="determinate"
                  value={progress}
                />{" "}
                <span style={{ marginLeft: "10px" }}>{progress}%</span>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={24} /> : null}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTopicModal;
