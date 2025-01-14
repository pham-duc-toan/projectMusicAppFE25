"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { decodeToken } from "@/app/helper/jwt";
import { useAppContext } from "@/context-app";
import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";

const CreatePlaylistButton = () => {
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
        userId: info_user?._id,
        title: title,
      });

      if (response?.data) {
        await revalidateByTag("revalidate-tag-list-playlist");

        showMessage("Đã tạo playlist mới thành công", "success");
      } else {
        showMessage("Bạn cần đăng nhập để tạo Playlist", "error");
      }
    } catch (error) {
      showMessage("Có lỗi xảy ra khi gọi API", "error");
    } finally {
      setLoading(false); // Kết thúc loading
      setOpen(false); // Đóng modal
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Tạo mới playlist
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
            Tạo Playlist Mới
          </Typography>
          <TextField
            fullWidth
            label="Tên Playlist"
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
                "Thêm"
              )}
            </Button>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CreatePlaylistButton;
