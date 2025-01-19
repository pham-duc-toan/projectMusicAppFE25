"use client";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import GoogleIcon from "@mui/icons-material/Google";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const ListProvider = () => {
  const t = useTranslations("FormLogin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.cookie =
      "next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }, []);

  const handleLoginWithGoogle = () => {
    setLoading(true); // ✅ Vô hiệu hóa nút khi bấm
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_WITH_GOOGLE || "";
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        disabled={loading} // ✅ Disable khi đang loading
        sx={{
          "@media (max-width: 768px)": {
            fontSize: "20px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleLoginWithGoogle}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          t("loginGoogle")
        )}
        {!loading && <GoogleIcon sx={{ marginLeft: "10px" }} />}
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
