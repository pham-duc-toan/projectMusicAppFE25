"use client";
import {
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
} from "@/app/helper/localStorageClient";
import { login, logout } from "@/app/utils/request";

import { useAppContext } from "@/context-app";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { useTheme } from "@emotion/react";
import ButtonRedirect from "@/component/buttonRedirect";
import {
  CustomTextFieldPassword,
  CustomTextFieldUsername,
} from "./text-field-customize";
import ListProvider from "./list-btn-login-provider";
import { useLocale } from "next-intl";

export default function FormLoginComponent() {
  const { showMessage } = useAppContext();
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
  const [errorUserName, setErrorUserName] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  useEffect(() => {
    const clearToken = async () => {
      removeTokensFromLocalStorage();
      await logout();
    };
    clearToken();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsErrorPassword(false);
    setIsErrorUsername(false);
    setErrorPassword("");
    setErrorUserName("");
    const user = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;
    if (!user) {
      setIsErrorUsername(true);
      setErrorUserName("Username is not empty.");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password is not empty.");
      return;
    }
    setIsLoading(true);
    const data = await login({
      username: user,
      password: password,
    });
    console.log(data);

    if (data.data) {
      setAccessTokenToLocalStorage(data.data.access_token);

      if (data.data.user.role.roleName == "Admin") {
        window.location.href = `/${locale}/admin`;
      } else {
        window.location.href = `/${locale}`;
      }
      setIsLoading(false);
    } else {
      showMessage(data.message, "error");
      setIsLoading(false);
    }
  };
  const theme = useTheme();
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "8px",
        background:
          //@ts-ignore
          theme.palette.mode === "dark"
            ? "#17002b"
            : "theme.pallete.background.default",
        boxShadow:
          //@ts-ignore
          theme.palette.mode === "dark"
            ? "0px 4px 15px rgba(255, 255, 255, 0.05)"
            : "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: "20px",
          color: "theme.palette.text.primary",
        }}
      >
        Đăng nhập
      </Typography>

      <CustomTextFieldUsername
        label="Tài khoản"
        variant="outlined"
        name="username"
        defaultValue={"a@a.com"}
        fullWidth
        margin="normal"
        autoFocus
        error={isErrorUsername}
        helperText={errorUserName}
      />

      <CustomTextFieldPassword
        label="Mật khẩu"
        defaultValue={"aaa"}
        type={showPassword ? "text" : "password"}
        variant="outlined"
        fullWidth
        name="password"
        margin="normal"
        error={isErrorPassword}
        helperText={errorPassword}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword == false ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginTop={"-10px"}
      >
        <ButtonRedirect
          content="Đăng ký"
          link="/register"
          sx={{
            marginLeft: "10px",
            fontSize: "12px",
            padding: "4px 8px",
            minWidth: "unset",
          }}
        />
        <ButtonRedirect
          content="Quên mật khẩu"
          link="/forgot-password"
          sx={{
            marginRight: "10px",
            fontSize: "12px",
            padding: "4px 8px",
            minWidth: "unset",
          }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        endIcon={isLoading ? <CircularProgress size={24} /> : null}
      >
        Đăng nhập
      </Button>

      <Button onClick={() => router.push(`/${locale}/`)}>
        Back to HomePage
      </Button>
      <ListProvider />
    </Box>
  );
}
