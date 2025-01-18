"use client";
import { Box, Button, CircularProgress } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const ListProvider = () => {
  const t = useTranslations("FormLogin");
  useEffect(() => {
    document.cookie =
      "next-auth.callback-url" +
      "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }, []);
  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{
          "@media (max-width: 768px)": {
            fontSize: "20px",
          },
        }}
        onClick={() => {
          window.location.href = process.env.NEXT_PUBLIC_LOGIN_WITH_GOOGLE + "";
        }}
      >
        {t("loginGoogle")}
        <GoogleIcon sx={{ marginLeft: "10px" }} />
      </Button>
      <Box
        sx={{
          fontSize: "12px",
          textDecoration: "underline",
          marginTop: "10px",
        }}
      >
        <Link href={"/"}>{t("buttons.backToHome")}</Link>
      </Box>
    </>
  );
};
export default ListProvider;
