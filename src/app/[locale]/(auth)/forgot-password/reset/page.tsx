"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import { apiBasicClientPublic } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  CustomTextFieldPassword,
  CustomTextFieldUsername,
} from "../../login/components/text-field-customize";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const ResetPasswordPage = () => {
  const t = useTranslations("resetPassword");
  const router = useRouter();
  const { showMessage } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    if (!otp || !newPassword || !confirmNewPassword) {
      setError(t("error.requiredFields"));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError(t("error.passwordMismatch"));
      return;
    }

    setLoading(true);
    setError("");
    const savedEmail = localStorage.getItem("emailResetPassword");

    try {
      const res = await apiBasicClientPublic(
        "POST",
        "/forgot-password/verify",
        undefined,
        {
          otp,
          passNew: newPassword,
          email: savedEmail,
        }
      );

      if (res?.statusCode >= 300) {
        showMessage(res.message, "error");
      } else {
        showMessage(t("success.passwordReset"), "success");
        localStorage.removeItem("emailResetPassword");
        router.push(`/login`);
      }
    } catch (error: any) {
      setError(error?.message || t("error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "50px auto",
        textAlign: "center",
        padding: 3,
        borderRadius: 2,
        backgroundColor: "primary.A100",
        width: "100%",
        "@media (max-width: 768px)": {
          padding: "15px",
          width: "90%",
        },
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        {t("title")}
      </Typography>

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
          label={t("label.otp")}
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <CustomTextFieldPassword
          fullWidth
          type="password"
          name="newPassword"
          label={t("label.newPassword")}
          variant="outlined"
          margin="normal"
        />
        <CustomTextFieldPassword
          fullWidth
          type="password"
          name="confirmNewPassword"
          label={t("label.confirmNewPassword")}
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
            t("button.resetPassword")
          )}
        </Button>
        <IconButton onClick={() => router.back()} aria-label={t("button.back")}>
          <ArrowBackIcon />
        </IconButton>
      </form>
    </Box>
  );
};

export default ResetPasswordPage;
