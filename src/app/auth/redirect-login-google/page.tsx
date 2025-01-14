"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import { ThemeProvider } from "@/app/theme-provider";
import { CircularProgress, Box } from "@mui/material";
import "@/app/globals.css";
export default function RedirectLoginGoogle() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    localStorage.setItem("accessToken", accessToken || "");

    window.location.href = "/";
  }, [searchParams]);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript defaultMode="system" />
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
