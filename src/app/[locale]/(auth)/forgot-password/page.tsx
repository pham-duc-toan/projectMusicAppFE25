"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useAppContext } from "@/context-app"; // Context để hiển thị thông báo
import { apiBasicClient, apiBasicClientPublic } from "@/app/utils/request";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CustomTextFieldUsername } from "../login/components/text-field-customize";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";

const ForgotPasswordPage = () => {
  const locale = useLocale();
  const { showMessage } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      showMessage("Vui lòng nhập email", "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiBasicClientPublic(
        "POST",
        "/forgot-password/request",
        undefined,
        { email }
      );
      if (res?.statusCode >= 300) {
        showMessage(res.message, "error");
      } else {
        showMessage(
          "Yêu cầu đặt lại mật khẩu đã được gửi, vui lòng kiểm tra email.",
          "success"
        );
        localStorage.setItem("emailResetPassword", email);
        router.push(`/forgot-password/reset`);
      }
    } catch (error: any) {
      showMessage(error?.message || "Có lỗi xảy ra", "error");
    } finally {
      setIsLoading(false);
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
        Quên mật khẩu
      </Typography>
      <form onSubmit={handleSubmit}>
        <CustomTextFieldUsername
          fullWidth
          type="email"
          name="email"
          label="Nhập email của bạn"
          variant="outlined"
          margin="normal"
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={isLoading}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
        <IconButton onClick={() => router.back()} aria-label="Quay lại">
          <ArrowBackIcon />
        </IconButton>
      </form>
    </Box>
  );
};

export default ForgotPasswordPage;
