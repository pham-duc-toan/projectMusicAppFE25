"use client";
import React, { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";

import CloseIcon from "@mui/icons-material/Close";

import { FileWithPath } from "react-dropzone";
import DropzoneComponent from "@/component/customDropzone/dropzoneComponent";
import { useAppContext } from "@/context-app";
import { useTranslations } from "next-intl";
import axios, { AxiosProgressEvent } from "axios";
import { apiBasicClient, refreshtoken } from "@/app/utils/request";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { revalidateByTag } from "@/app/action";
import { useDispatch } from "react-redux";
import { setLogin } from "@/store/authSlice";

interface User {
  id: string;
  fullName: string;
  username: string;
  role: string;
  type: string;
  avatar?: string;
}

const EditUserPage: React.FC = () => {
  const t = useTranslations("EditUser");
  const { showMessage } = useAppContext();
  const [user, setUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiBasicClient("GET", "/users/profile");
        if (response.statusCode === 200) {
          setUser(response.data);
          setAvatarPreview(response.data.avatar || null);
        } else {
          showMessage(response.message || t("errors.fetchUserData"), "error");
        }
      } catch (error) {
        showMessage(t("errors.serverError"), "error");
      }
    };

    fetchUserData();
  }, []);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarFile(file);
      }
    });
  }, []);

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const accessToken = getAccessTokenFromLocalStorage();
    const form = e.currentTarget;
    const fullName = form.fullName.value || "";

    const formData = new FormData();
    formData.append("fullName", fullName);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    setLoading(true);
    try {
      const response = await axios.patchForm(
        process.env.NEXT_PUBLIC_BACK_END_URL + `/users/detail`,
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
        setUser(response.data.data);
        await refreshtoken();
        dispatch(setLogin());
        await revalidateByTag("revalidate-tag-users");
        showMessage(t("messages.updateSuccess"), "success");
      } else {
        showMessage(response.data.message || t("errors.updateFailed"), "error");
      }
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || t("errors.serverError"),
        "error"
      );
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} marginTop={"10px"}>
            <TextField
              fullWidth
              size="small"
              label={t("fields.fullName")}
              name="fullName"
              defaultValue={user.fullName}
              required
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
                  alt={t("avatarPreview")}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <CardContent>
                  <Typography>{t("avatarPreview")}</Typography>
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
            <Grid item xs={12}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography align="center">{progress}%</Typography>
            </Grid>
          )}

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={24} /> : null}
            >
              {loading ? t("buttons.updating") : t("buttons.update")}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditUserPage;
