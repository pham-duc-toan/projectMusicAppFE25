"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import "@/app/globals.css";

export default function LocalStorageSetter({
  accessToken,
}: {
  accessToken: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    // 👉 Sau khi set xong, redirect về trang chủ
    router.push("/");
  }, [accessToken, router]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
