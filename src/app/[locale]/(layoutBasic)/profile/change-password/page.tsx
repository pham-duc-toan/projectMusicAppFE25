"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiBasicClient, refreshtoken } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const ChangePasswordPage = () => {
  const { showMessage } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  // State để điều khiển hiển thị mật khẩu và trạng thái submit
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    setShowPassword((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lấy giá trị từ form thông qua e.target
    const formData = new FormData(e.currentTarget);
    const data = {
      passOld: formData.get("oldPassword") as string,
      passNew: formData.get("newPassword") as string,
      confirmPassNew: formData.get("confirmNewPassword") as string,
    };

    // Kiểm tra dữ liệu nhập
    if (!data.passOld || !data.passNew || !data.confirmPassNew) {
      showMessage("Vui lòng nhập đủ thông tin", "error");
      return;
    }

    if (data.passNew !== data.confirmPassNew) {
      showMessage("Mật khẩu mới và xác nhận không khớp", "error");
      return;
    }

    try {
      setIsSubmitting(true); // Bật trạng thái "đang xử lý"
      const res = await apiBasicClient(
        "PATCH",
        "/users/change-password",
        undefined,
        { passOld: data.passOld, passNew: data.passNew }
      );

      if (res?.statusCode >= 300) {
        showMessage(res.message, "error");
      } else {
        await refreshtoken();
        showMessage("Đổi mật khẩu thành công!", "success");
        router.push(`/${locale}/`);
      }
    } catch (error: any) {
      showMessage(error?.message || "Có lỗi xảy ra", "error");
    } finally {
      setIsSubmitting(false); // Tắt trạng thái "đang xử lý"
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        textAlign: "center",
        padding: 3,

        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Đổi mật khẩu
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type={showPassword.oldPassword ? "text" : "password"}
          name="oldPassword"
          label="Mật khẩu cũ"
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("oldPassword")}
                  edge="end"
                >
                  {showPassword.oldPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showPassword.newPassword ? "text" : "password"}
          name="newPassword"
          label="Mật khẩu mới"
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("newPassword")}
                  edge="end"
                >
                  {showPassword.newPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type={showPassword.confirmNewPassword ? "text" : "password"}
          name="confirmNewPassword"
          label="Nhập lại mật khẩu mới"
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  edge="end"
                >
                  {showPassword.confirmNewPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={isSubmitting} // Vô hiệu hóa nút khi đang xử lý
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null} // Hiển thị vòng xoay
        >
          {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </Box>
  );
};

export default ChangePasswordPage;
