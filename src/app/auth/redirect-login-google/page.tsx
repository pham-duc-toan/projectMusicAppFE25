"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import "@/app/globals.css";
export const dynamic = "force-dynamic"; // Chặn SSG
function RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const accessExpire = searchParams.get("access_expire")
      ? parseInt(searchParams.get("access_expire")!, 10)
      : 600; // Mặc định 10 phút
    const refreshExpire = searchParams.get("refresh_expire")
      ? parseInt(searchParams.get("refresh_expire")!, 10)
      : 86400; // Mặc định 1 ngày

    if (accessToken && refreshToken) {
      // 👉 Gọi API để set cookie trên server
      fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/setTokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          refreshToken,
          accessExpire,
          refreshExpire,
        }),
      })
        .then(() => {
          // 👉 Sau khi set cookie, lưu vào localStorage
          localStorage.setItem("accessToken", accessToken);
          router.push("/"); // Chuyển hướng về trang chủ
        })
        .catch((err) => console.error("Lỗi khi set cookie:", err));
    } else {
      router.push("/"); // Nếu không có token, quay về trang chủ
    }
  }, [searchParams, router]);

  return null;
}

export default function RedirectLoginGoogle() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <RedirectHandler />
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
    </Suspense>
  );
}
