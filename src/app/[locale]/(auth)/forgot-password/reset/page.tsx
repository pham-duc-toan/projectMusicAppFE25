"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { apiBasicClientPublic } from "@/app/utils/request"; // API client để gửi yêu cầu
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context-app";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  CustomTextFieldPassword,
  CustomTextFieldUsername,
} from "../../login/components/text-field-customize";
import { useLocale } from "next-intl";

const ResetPasswordPage = () => {
  const router = useRouter();
  const locale = useLocale();
  const { showMessage } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading khi gửi yêu cầu
  const [error, setError] = useState<string>(""); // Thông báo lỗi

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lấy giá trị từ form thông qua e.target
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    // Kiểm tra dữ liệu nhập
    if (!otp || !newPassword || !confirmNewPassword) {
      setError("Vui lòng nhập đủ thông tin.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    setError("");
    const savedEmail = localStorage.getItem("emailResetPassword");
    console.log(savedEmail);

    try {
      // Gửi yêu cầu reset mật khẩu lên backend
      const res = await apiBasicClientPublic(
        "POST",
        "/forgot-password/verify",
        undefined,
        {
          otp,
          passNew: newPassword,
          email: savedEmail, // Gửi email đi kèm để thay đổi mật khẩu
        }
      );

      // Nếu có lỗi trong response
      if (res?.statusCode >= 300) {
        showMessage(res.message, "error");
      } else {
        // Reset mật khẩu thành công
        showMessage("Mật khẩu đã được thay đổi thành công!", "success");

        // Xóa email khỏi localStorage sau khi reset thành công
        localStorage.removeItem("emailResetPassword");

        router.push(`/${locale}/login`); // Chuyển về trang login sau khi reset thành công
      }
    } catch (error: any) {
      setError(error?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
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
        Đặt lại mật khẩu
      </Typography>

      {/* Form nhập OTP và mật khẩu mới */}
      <form onSubmit={handleSubmit}>
        {error && (
          <Typography variant="body2" color="primary" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
        )}

        <CustomTextFieldUsername
          fullWidth
          type="text"
          name="otp"
          label="Mã OTP"
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <CustomTextFieldPassword
          fullWidth
          type="password"
          name="newPassword"
          label="Mật khẩu mới"
          variant="outlined"
          margin="normal"
        />
        <CustomTextFieldPassword
          fullWidth
          type="password"
          name="confirmNewPassword"
          label="Nhập lại mật khẩu mới"
          variant="outlined"
          margin="normal"
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>
        <IconButton onClick={() => router.back()} aria-label="Quay lại">
          <ArrowBackIcon />
        </IconButton>
      </form>
    </Box>
  );
};

export default ResetPasswordPage;
