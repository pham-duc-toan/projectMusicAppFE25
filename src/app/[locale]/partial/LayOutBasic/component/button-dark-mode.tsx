"use client";
import Button from "@mui/material/Button";
import { useColorScheme } from "@mui/material/styles";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useEffect, useState } from "react";

export function SwitchThemeButton() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  const alternativeScheme = colorScheme === "light" ? "dark" : "light";

  useEffect(() => {
    // Chỉ định mounted là true sau khi client đã render xong
    setMounted(true);
  }, []);

  if (!mounted) {
    // Tránh render khác nhau giữa server và client
    return null;
  }

  return (
    <Button
      variant="contained"
      onClick={() => setColorScheme(alternativeScheme)}
    >
      {colorScheme == "light" ? <LightModeIcon /> : <DarkModeIcon />}
    </Button>
  );
}
