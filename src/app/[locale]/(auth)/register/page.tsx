"use client";

import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  apiBasicClient,
  apiBasicClientPublic,
  login,
} from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { useRouter } from "next/navigation";
import { setAccessTokenToLocalStorage } from "@/app/helper/localStorageClient";
import {
  CustomTextFieldPassword,
  CustomTextFieldUsername,
} from "../login/components/text-field-customize";
import { useLocale } from "next-intl";

const RegisterPage = () => {
  const { showMessage } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false); // State để kiểm soát hiệu ứng disable

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      fullName: formData.get("fullName") as string,
      userId: formData.get("userId") as string,
    };

    // Kiểm tra dữ liệu
    if (
      !data.username ||
      !data.password ||
      !data.confirmPassword ||
      !data.fullName ||
      !data.userId
    ) {
      showMessage("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showMessage("Mật khẩu và xác nhận mật khẩu không khớp", "error");
      return;
    }

    try {
      setIsSubmitting(true); // Hiển thị trạng thái "Đang xử lý"

      // Gửi API
      const res = await apiBasicClientPublic(
        "POST",
        "/users/create",
        undefined,
        {
          username: data.username,
          password: data.password,
          fullName: data.fullName,
          userId: data.userId,
          type: "SYSTEM",
        }
      );

      if (res?.statusCode >= 300) {
        if (Array.isArray(res.message)) {
          // Lặp qua từng phần tử trong mảng và hiển thị
          res.message.forEach((msg: string) => showMessage(msg, "error"));
        } else {
          showMessage(res.message, "error"); // Trường hợp `message` không phải mảng
        }
      } else {
        const res = await login({
          username: data.username,
          password: data.password,
        });
        if (res.statusCode >= 300) {
          showMessage(res?.message, "error");
        } else {
          if (res.data) {
            setAccessTokenToLocalStorage(res.data.access_token);

            window.location.href = `/${locale}`;
          }
        }
      }
    } catch (error: any) {
      showMessage(error?.message || "Có lỗi xảy ra", "error");
    } finally {
      setIsSubmitting(false); // Tắt trạng thái "Đang xử lý"
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
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Đăng ký tài khoản
      </Typography>
      <form onSubmit={handleSubmit}>
        <CustomTextFieldUsername
          fullWidth
          name="username"
          label="Tên đăng nhập"
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <TextField
          size="small"
          fullWidth
          name="fullName"
          label="Họ và tên"
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <TextField
          size="small"
          fullWidth
          name="userId"
          label="ID người dùng"
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <CustomTextFieldPassword
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <TextField
          size="small"
          fullWidth
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          type="password"
          variant="outlined"
          margin="normal"
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={isSubmitting} // Disable nút khi đang xử lý
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null} // Spinner trong nút
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </Button>
        <IconButton onClick={() => router.back()} aria-label="Quay lại">
          <ArrowBackIcon />
        </IconButton>
      </form>
    </Box>
  );
};

export default RegisterPage;
