"use client";
import React, { useState, useCallback, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

import CloseIcon from "@mui/icons-material/Close";

import { FileWithPath } from "react-dropzone";
import DropzoneComponent from "@/component/customDropzone/dropzoneComponent";
import { useAppContext } from "@/context-app";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";

import axios, { AxiosProgressEvent } from "axios";
import SelectorSuggest from "@/component/selectorSuggest";
import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";

interface EditSongModalProps {
  open: boolean;
  onClose: () => void;
  song: any;
}

const EditSongModal: React.FC<EditSongModalProps> = ({
  open,
  onClose,
  song,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const { showMessage } = useAppContext();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("active");

  const t = useTranslations("editSong"); // 🔥 Lấy dữ liệu từ file JSON song ngữ

  useEffect(() => {
    if (song && open) {
      setAvatarPreview(song.avatar || null);
      setAudioPreview(song.audio || null);
      setStatus(song.status || "active");
      setMounted(true);
    }
  }, [song, open]);

  // Hàm xử lý file upload
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarFile(file);
      }
      if (file.type.startsWith("audio/")) {
        setAudioPreview(URL.createObjectURL(file));
        setAudioFile(file);
      }
    });
  }, []);

  // Hàm xử lý gửi form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = getAccessTokenFromLocalStorage();
    const form = e.currentTarget;
    //@ts-ignore
    const title = form.title.value || "";
    const description = form.description.value || "";
    const inputTopic = form.querySelector('input[name="topic"]');
    const valueidTopic = inputTopic?.getAttribute("valueid") || "";
    const lyrics = form.lyrics.value || "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("topic", valueidTopic);
    formData.append("status", status);
    formData.append("lyrics", lyrics);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (audioFile) {
      formData.append("audio", audioFile);
    }

    setLoading(true);
    try {
      const response = await axios.patchForm(
        process.env.NEXT_PUBLIC_BACK_END_URL + `/songs/editSong/${song.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        await revalidateByTag("revalidate-tag-songs");
        showMessage(t("successMessage"), "success");
        onClose();
      } else {
        showMessage(response.data.message || t("errorMessage"), "error");
      }
    } catch (error: any) {
      showMessage(error.response?.data?.message || t("uploadError"), "error");
    } finally {
      setProgress(0);
      setLoading(false);
    }
  };
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleRemoveAudio = () => {
    setAudioPreview(null);
    setAudioFile(null);
  };
  const handleStatusChange = (event: any) => {
    setStatus(event.target.value as string);
  };

  if (!mounted) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "100px", // khoảng cách trên
        paddingBottom: "100px", // khoảng cách dưới
      }}
    >
      <DialogTitle>{t("editSongTitle")}</DialogTitle>
      <DialogContent
        sx={{
          maxHeight: "calc(100vh - 200px)", // Đảm bảo modal không quá lớn
          overflowY: "auto", // Kích hoạt thanh cuộn nếu cần
          scrollbarWidth: "thin", // Đảm bảo thanh cuộn nhỏ trên Firefox
          "&::-webkit-scrollbar": { width: "6px" }, // Đảm bảo thanh cuộn nhỏ trên Chrome
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
        }}
      >
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
                label={t("title")}
                name="title"
                defaultValue={song.title}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <SelectorSuggest
                suggestKey="title"
                urlFetch="/topics"
                label={t("topic")}
                name="topic"
                defaultKey={{
                  value: song?.topic?.title || "",
                  id: song?.topic?.id || "",
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("status")}</InputLabel>
                <Select
                  label={t("status")}
                  name="status"
                  defaultValue={song.status}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="active">{t("statusActive")}</MenuItem>
                  <MenuItem value="inactive">{t("statusInactive")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                label={t("lyrics")}
                name="lyrics"
                defaultValue={song.lyrics || ""}
                multiline
                placeholder={t("lyricsPlaceholder")}
                minRows={4}
                maxRows={10}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                fullWidth
                defaultChecked={song.description || ""}
                label={t("description")}
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
                    }} // Kích thước cố định
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

            {/* Audio Upload */}
            {audioPreview && (
              <Grid item>
                <Card sx={{ position: "relative" }}>
                  <CardContent
                    sx={{
                      display: { xs: "block", sm: "flex" },
                      alignItems: { sm: "center" },
                    }}
                  >
                    <audio controls style={{ marginRight: "16px" }}>
                      <source src={audioPreview} type="audio/mpeg" />
                      {t("audioNotSupported")}
                    </audio>
                    <Typography>{t("audioPreview")}</Typography>
                    <IconButton
                      onClick={handleRemoveAudio}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "red",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{
                display: !(audioPreview && avatarPreview) ? "flex" : "none",
                justifyContent: !(audioPreview && avatarPreview)
                  ? "center"
                  : undefined,
                alignItems: !(audioPreview && avatarPreview)
                  ? "center"
                  : undefined,
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
                {loading ? t("submitting") : t("submit")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSongModal;
