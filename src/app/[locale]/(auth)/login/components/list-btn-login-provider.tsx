"use client";
import { Box, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect } from "react";

const ListProvider = () => {
  useEffect(() => {
    document.cookie =
      "next-auth.callback-url" +
      "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button>
          <GitHubIcon />
        </Button>
        <Button
          onClick={() => {
            window.location.href =
              process.env.NEXT_PUBLIC_LOGIN_WITH_GOOGLE + "";
          }}
        >
          <GoogleIcon />
        </Button>
      </Box>
    </>
  );
};
export default ListProvider;
