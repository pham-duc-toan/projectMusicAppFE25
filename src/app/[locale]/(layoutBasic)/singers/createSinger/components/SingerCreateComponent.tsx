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
import { refreshtoken } from "@/app/utils/request";
import { useRouter } from "next/navigation";
import DropzoneComponent from "@/component/customDropzone/dropzoneComponent";
import { useLocale, useTranslations } from "next-intl";

function SingerCreateComponent() {
  const t = useTranslations("SingerCreateComponent");
  const { showMessage } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
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
    const formData = new FormData();
    formData.append("fullName", title);
    formData.append("status", status);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    } else {
      showMessage(t("messages.missingAvatar"), "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACK_END_URL + "/singers/create",
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
        await revalidateByTag("revalidate-tag-singers");
        await revalidateByTag("revalidate-tag-infoUser");
        showMessage(t("messages.createSuccess"), "success");
        setAvatarPreview(null);
        setAvatarFile(null);
        setStatus("active");
        await refreshtoken();
        form.reset();
        window.location.href = `/${locale}`;
      } else {
        showMessage(response.data.message || t("messages.error"), "error");
      }
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || t("messages.uploadError"),
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
        <Grid item xs={12} md={4}>
          <TextField
            sx={{ width: "100%" }}
            size="small"
            label={t("fields.fullName")}
            name="title"
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>{t("fields.status")}</InputLabel>
            <Select
              label={t("fields.status")}
              name="status"
              value={status}
              onChange={handleStatusChange}
            >
              <MenuItem value="active">{t("status.active")}</MenuItem>
              <MenuItem value="inactive">{t("status.inactive")}</MenuItem>
            </Select>
          </FormControl>
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
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
              <CardContent>
                <Typography>{t("avatarPreview")}</Typography>
              </CardContent>
              <IconButton
                onClick={handleRemoveAvatar}
                sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
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
            justifyContent: "center",
            alignItems: "center",
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

export default SingerCreateComponent;
