"use client";
import axios, { AxiosProgressEvent } from "axios";
import React, { useState, useCallback } from "react";
import { FileWithPath } from "react-dropzone";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./style.css";

import { useAppContext } from "@/context-app";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";

import { revalidateByTag } from "@/app/action";
import DropzoneComponent from "@/component/customDropzone/dropzoneComponent";

function TopicCreateComponent() {
  const { showMessage } = useAppContext();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("active");
  // Hàm để xử lý file upload và xem trước avatar/audio
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
    setLoading(true);
    const form = e.currentTarget;
    //@ts-ignore
    const title = form.title.value || "";
    const description = form.description.value || "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);

    // Thêm file vào formData nếu có
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    } else {
      //thông báo lỗi
      showMessage("Vui lòng tải thêm file ảnh", "error");
    }

    // Gửi formData lên server
    try {
      // Sử dụng Axios để upload file và theo dõi tiến trình
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACK_END_URL + "/topics/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total!);
            setProgress(percentCompleted); // Cập nhật tiến trình
          },
        }
      );

      if (response.status === 201) {
        await revalidateByTag("revalidate-tag-topics");
        setAvatarPreview(null);
        setAvatarFile(null);
        setStatus("active");
        form.reset();
        showMessage("Tạo mới thành công !", "success");
      } else {
        showMessage(response.data.message || "Something went wrong", "error");
      }
    } catch (error: any) {
      showMessage(error.response?.data?.message || "Lỗi khi upload!", "error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleStatusChange = (event: any) => {
    setStatus(event.target.value as string);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            sx={{
              width: {
                xs: "100%",
              },
            }}
            size="small"
            label="Title"
            name="title"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={status}
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
            label="Description"
            name="description"
            multiline
            minRows={4}
            maxRows={10}
          />
        </Grid>

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
                style={{ width: "200px", height: "200px", objectFit: "cover" }} // Kích thước cố định
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

        <Grid
          item
          xs={12}
          sx={{
            display: !avatarPreview ? "flex" : "none",
            justifyContent: !avatarPreview ? "center" : undefined,
            alignItems: !avatarPreview ? "center" : undefined,
          }}
        >
          <DropzoneComponent onDrop={onDrop} />
        </Grid>

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
  );
}

export default TopicCreateComponent;
