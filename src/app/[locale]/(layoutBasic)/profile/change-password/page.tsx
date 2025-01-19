"use client";
import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { apiBasicClient, refreshtoken } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const ChangePasswordPage = () => {
  const t = useTranslations("ChangePassword");
  const { showMessage } = useAppContext();
  const router = useRouter();

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

    const formData = new FormData(e.currentTarget);
    const data = {
      passOld: formData.get("oldPassword") as string,
      passNew: formData.get("newPassword") as string,
      confirmPassNew: formData.get("confirmNewPassword") as string,
    };

    if (!data.passOld || !data.passNew || !data.confirmPassNew) {
      showMessage(t("errors.emptyFields"), "error");
      return;
    }

    if (data.passNew !== data.confirmPassNew) {
      showMessage(t("errors.passwordMismatch"), "error");
      return;
    }

    try {
      setIsSubmitting(true);
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
        showMessage(t("messages.success"), "success");
        router.push("/");
      }
    } catch (error: any) {
      showMessage(error?.message || t("errors.serverError"), "error");
    } finally {
      setIsSubmitting(false);
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
        <TextField
          fullWidth
          type={showPassword.oldPassword ? "text" : "password"}
          name="oldPassword"
          label={t("fields.oldPassword")}
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
          label={t("fields.newPassword")}
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
          label={t("fields.confirmNewPassword")}
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
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? t("buttons.processing") : t("buttons.submit")}
        </Button>
      </form>
    </Box>
  );
};

export default ChangePasswordPage;
