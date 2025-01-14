import React from "react";
import { Box, Typography, Button } from "@mui/material";

import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
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
        alt="404"
        style={{
          marginBottom: "20px",
        }}
      />

      {/* Tiêu đề 404 */}
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Trang bạn tìm kiếm không tồn tại!
      </Typography>

      {/* Nút quay lại trang chủ */}
      <Button variant="contained" color="primary" component={Link} href="/">
        Về Trang Chủ
      </Button>
    </Box>
  );
};

export default NotFoundPage;
