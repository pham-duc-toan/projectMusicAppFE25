"use client";
import axios, { AxiosProgressEvent } from "axios";
import React, { useState, useCallback } from "react";
import { FileWithPath } from "react-dropzone";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";

import CloseIcon from "@mui/icons-material/Close";

import "./style.css";

import { useAppContext } from "@/context-app";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";

import { revalidateByTag } from "@/app/action";
import DropzoneComponent from "@/component/customDropzone/dropzoneComponent";
import { useTranslations } from "next-intl";

function TopicCreateComponent() {
  const t = useTranslations("topicCreateComponent");
  const { showMessage } = useAppContext();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("active");

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

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    } else {
      showMessage(t("messages.uploadError"), "error");
      setLoading(false);
      return;
    }

    try {
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
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 201) {
        await revalidateByTag("revalidate-tag-topics");
        setAvatarPreview(null);
        setAvatarFile(null);
        setStatus("active");
        form.reset();
        showMessage(t("messages.createSuccess"), "success");
      } else {
        showMessage(
          response.data.message || t("messages.uploadFailure"),
          "error"
        );
      }
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || t("messages.uploadFailure"),
        "error"
      );
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
            sx={{ width: "100%" }}
            size="small"
            label={t("fields.title")}
            name="title"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>{t("fields.status")}</InputLabel>
            <Select
              label={t("fields.status")}
              name="status"
              value={status}
              onChange={handleStatusChange}
            >
              <MenuItem value="active">{t("statusOptions.active")}</MenuItem>
              <MenuItem value="inactive">
                {t("statusOptions.inactive")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            label={t("fields.description")}
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
                alt={t("fields.avatarPreview")}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
              <CardContent>
                <Typography>{t("fields.avatarPreview")}</Typography>
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
              sx={{ width: "100px" }}
              variant="determinate"
              value={progress}
            />
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
            {loading ? t("buttons.submitting") : t("buttons.submit")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default TopicCreateComponent;
