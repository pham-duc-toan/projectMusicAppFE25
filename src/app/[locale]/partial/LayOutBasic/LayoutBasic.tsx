"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import HeaderComponent from "./header";
import SiderComponent from "./sider";
import FooterComponent from "./footer";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { decodeToken } from "@/app/helper/jwt";
import SiderAdminComponent from "./siderAdmin";
import IUserInfo from "@/dataType/infoUser";

export default function LayoutBasic({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const access_token = getAccessTokenFromLocalStorage() || undefined;
  const userInfo: IUserInfo | undefined = decodeToken(access_token);

  // Sử dụng state isClient để đảm bảo rằng code chỉ chạy trên client
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    // Chỉ thay đổi trạng thái sau khi component mount trên client
    setIsClient(userInfo?.role.roleName === "Admin");
  }, []);

  React.useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isSmallScreen]);

  return (
    <>
      <CssBaseline />
      {/* <Box sx={{ display: "flex" }}> */}
      <HeaderComponent open={open} />
      {isClient ? (
        <SiderAdminComponent open={open} />
      ) : (
        <SiderComponent open={open} />
      )}

      <Box component="main" sx={{ marginLeft: open ? "280px" : "65px" }}>
        <Box>
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: theme.spacing(0, 1),
                ...theme.mixins.toolbar,
              }}
            />
            {children}
          </Container>
        </Box>
      </Box>
      {/* </Box> */}
      <FooterComponent />
    </>
  );
}
