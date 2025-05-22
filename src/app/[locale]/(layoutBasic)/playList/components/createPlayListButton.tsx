"use client";

import { useState } from "react";

import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { decodeToken } from "@/app/helper/jwt";
import { useAppContext } from "@/context-app";
import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";

const CreatePlaylistButton = () => {
  const t = useTranslations("CreatePlaylist");
  const access_token = getAccessTokenFromLocalStorage();
  const info_user = decodeToken(access_token || undefined);
  const { showMessage } = useAppContext();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

  const handleOpen = () => {
    setOpen(true);
    setTitle("");
  };
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setLoading(false); // Reset loading khi đóng modal
  };

  const handleCreate = async () => {
    if (title.trim() === "") return; // Không thêm nếu tiêu đề trống

    setLoading(true); // Bắt đầu loading

    try {
      const response = await apiBasicClient("POST", "/playlists", undefined, {
        //@ts-ignore
        userId: info_user?.id,
        title: title,
      });

      if (response?.data) {
        await revalidateByTag("revalidate-tag-list-playlist");

        showMessage(t("messages.success"), "success");
      } else {
        showMessage(t("messages.loginRequired"), "error");
      }
    } catch (error) {
      showMessage(t("messages.apiError"), "error");
    } finally {
      setLoading(false); // Kết thúc loading
      setOpen(false); // Đóng modal
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        {t("buttons.createNew")}
      </Button>

      {/* Modal for creating new playlist */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t("title")}
          </Typography>
          <TextField
            fullWidth
            label={t("fields.playlistName")}
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading} // Vô hiệu hóa nút nếu đang loading
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("buttons.add")
              )}
            </Button>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              {t("buttons.cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CreatePlaylistButton;
