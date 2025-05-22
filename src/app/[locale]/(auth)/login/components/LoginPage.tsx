"use client";
import {
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
} from "@/app/helper/localStorageClient";
import { login, logout } from "@/app/utils/request";
import { useAppContext } from "@/context-app";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import { useEffect, useState } from "react";

import ButtonRedirect from "@/component/buttonRedirect";
import { styled } from "@mui/material/styles";

import { useLocale, useTranslations } from "next-intl";
import {
  CustomTextFieldPassword,
  CustomTextFieldUsername,
} from "./text-field-customize";
import ListProvider from "./btnLoginWithGoogle";

export default function LoginPage() {
  const { showMessage } = useAppContext();
  const t = useTranslations("FormLogin");
  const locale = useLocale();
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
  const BackgroundBox = styled(Box)(({ theme }) => ({
    width: "60%",
    height: "100vh",
    display: "flex",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url('/lightloginback2.jpg')`, // Default cho Light Mode

    // Áp dụng CSS đúng dựa trên theme của MUI
    [`[data-mui-color-scheme='dark'] &`]: {
      backgroundImage: `url('/backlogin.jpeg')`,
    },

    [`@media (max-width: 768px)`]: {
      display: "none",
    },
  }));

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
      setErrorUserName(t("errors.usernameEmpty"));
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword(t("errors.passwordEmpty"));
      return;
    }

    setIsLoading(true);
    const data = await login({
      username: user,
      password: password,
    });

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

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        backgroundColor: "primary.A100",
        justifyContent: "center",
        alignItems: "center",
        "@media (min-width: 768px)": {
          flexDirection: "row",
        },
        "@media (max-width: 768px)": {
          flexDirection: "column",
        },
      }}
    >
      <BackgroundBox />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "8px",
          width: "40%",
          "@media (max-width: 768px)": {
            padding: "15px",
            width: "90%",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: "30px",
            marginBottom: "20px",
            color: "text.primary",
            textAlign: "center",
          }}
        >
          {t("title")}
        </Typography>

        <CustomTextFieldUsername
          label={t("fields.username")}
          variant="outlined"
          name="username"
          defaultValue={"abc@abc.com"}
          fullWidth
          margin="normal"
          autoFocus
          error={isErrorUsername}
          helperText={errorUserName}
        />

        <CustomTextFieldPassword
          label={t("fields.password")}
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
          sx={{
            "@media (max-width: 768px)": {
              flexDirection: "column",
              gap: "10px",
            },
          }}
        >
          <ButtonRedirect
            content={t("buttons.register")}
            link="/register"
            sx={{
              marginLeft: "10px",
              fontSize: "12px",
              padding: "4px 8px",
              minWidth: "unset",
            }}
          />
          <ButtonRedirect
            content={t("buttons.forgotPassword")}
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
          sx={{
            "@media (max-width: 768px)": {
              fontSize: "20px",
            },
          }}
          endIcon={isLoading ? <CircularProgress size={24} /> : null}
        >
          {t("buttons.login")}
        </Button>

        <Divider
          sx={{
            width: "100%",
            margin: "10px 0",
            position: "relative",
            "&::before, &::after": {
              content: '""',
              flex: "1",
              height: "1px",
            },
            "&::before": {
              marginRight: "10px",
            },
            "&::after": {
              marginLeft: "10px",
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {t("divider.or")}
          </Typography>
        </Divider>

        <ListProvider />
      </Box>
    </Box>
  );
}
