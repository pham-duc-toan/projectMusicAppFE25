"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import "@/app/globals.css";

export const dynamic = "force-dynamic"; // Chặn SSG

function RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      router.push("/");
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
