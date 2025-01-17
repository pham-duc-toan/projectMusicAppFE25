"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useAppContext } from "@/context-app";
import { apiBasicClientPublic } from "@/app/utils/request";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CustomTextFieldUsername } from "../login/components/text-field-customize";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

const ForgotPasswordPage = () => {
  const t = useTranslations("forgotPassword");
  const { showMessage } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      showMessage(t("messages.emailRequired"), "error");
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
        showMessage(t("messages.requestSuccess"), "success");
        localStorage.setItem("emailResetPassword", email);
        router.push(`/forgot-password/reset`);
      }
    } catch (error: any) {
      showMessage(error?.message || t("messages.error"), "error");
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
        {t("title")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <CustomTextFieldUsername
          fullWidth
          type="email"
          name="email"
          label={t("form.emailPlaceholder")}
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
          {isLoading ? t("form.loading") : t("form.submit")}
        </Button>
        <IconButton onClick={() => router.back()} aria-label={t("button.back")}>
          <ArrowBackIcon />
        </IconButton>
      </form>
    </Box>
  );
};

export default ForgotPasswordPage;
