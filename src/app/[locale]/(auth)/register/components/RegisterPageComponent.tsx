"use client";

import React, { useState } from "react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";

import { apiBasicClientPublic, login } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { useRouter } from "next/navigation";
import { setAccessTokenToLocalStorage } from "@/app/helper/localStorageClient";

import { useLocale, useTranslations } from "next-intl";
import {
  CustomTextFieldPassword,
  CustomTextFieldUsername,
} from "../../login/components/text-field-customize";

const RegisterPageComponent = () => {
  const { showMessage } = useAppContext();
  const t = useTranslations("RegisterPage");
  const router = useRouter();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      fullName: formData.get("fullName") as string,
      userId: formData.get("userId") as string,
    };

    if (
      !data.username ||
      !data.password ||
      !data.confirmPassword ||
      !data.fullName ||
      !data.userId
    ) {
      showMessage(t("errors.missingFields"), "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showMessage(t("errors.passwordMismatch"), "error");
      return;
    }

    try {
      setIsSubmitting(true);

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
          res.message.forEach((msg: string) => showMessage(msg, "error"));
        } else {
          showMessage(res.message, "error");
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
      showMessage(error?.message || t("errors.unknownError"), "error");
    } finally {
      setIsSubmitting(false);
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
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",

        backgroundColor: "primary.A100",

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
        <CustomTextFieldUsername
          fullWidth
          name="username"
          label={t("fields.username")}
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <TextField
          size="small"
          fullWidth
          name="fullName"
          label={t("fields.fullName")}
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <TextField
          size="small"
          fullWidth
          name="userId"
          label={t("fields.userId")}
          variant="outlined"
          margin="normal"
          autoFocus
        />
        <CustomTextFieldPassword
          fullWidth
          name="password"
          label={t("fields.password")}
          type="password"
          variant="outlined"
          margin="normal"
        />
        <TextField
          size="small"
          fullWidth
          name="confirmPassword"
          label={t("fields.confirmPassword")}
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
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? t("buttons.processing") : t("buttons.register")}
        </Button>
        <IconButton
          onClick={() => router.back()}
          aria-label={t("buttons.back")}
        >
          <ArrowBackIcon />
        </IconButton>
      </form>
    </Box>
  );
};

export default RegisterPageComponent;
