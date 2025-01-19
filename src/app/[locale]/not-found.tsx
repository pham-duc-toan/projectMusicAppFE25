import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "404 - Not Found",
};

const NotFoundPage = async () => {
  const t = await getTranslations("NotFoundPage");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Chiếm toàn bộ chiều cao của màn hình
        textAlign: "center",
        padding: 2,
      }}
    >
      {/* Hình ảnh */}
      <Image
        src="https://res.cloudinary.com/dsi9ercdo/image/upload/v1733576990/orcc8iivkfoe8vw50gcg.png"
        width={160}
        height={200}
        alt={t("imageAlt")}
        style={{
          marginBottom: "20px",
        }}
      />

      {/* Tiêu đề 404 */}
      <Typography variant="h1" color="error" gutterBottom>
        {t("title")}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t("description")}
      </Typography>

      {/* Nút quay lại trang chủ */}
      <Button variant="contained" color="primary" component={Link} href="/">
        {t("goHome")}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
