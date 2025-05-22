"use client";
import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/app/helper/localStorageClient";
import { logout } from "@/app/utils/request";
import { JwtPayload } from "jsonwebtoken";

import { Link } from "@/i18n/routing";
import { useAppContext } from "@/context-app";
import IUserInfo from "@/dataType/infoUser";
import { useLocale, useTranslations } from "next-intl";

import LogoutIcon from "@mui/icons-material/Logout";
import { decodeToken } from "@/app/helper/jwt";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function BtnLoginLogout() {
  const is = useSelector((state: RootState) => state.auth.isLogin);
  const { showMessage } = useAppContext();
  const [isLogin, setIsLogin] = useState<
    string | JwtPayload | null | undefined
  >(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const locale = useLocale();
  const [infoUser, setInfoUser] = useState<IUserInfo | undefined>(undefined);
  const t = useTranslations("Layout");
  const t2 = useTranslations("Notification");
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (!accessToken) {
      setIsLogin(null);
    } else {
      const info = decodeToken(accessToken);
      setInfoUser(info || undefined);
      setIsLogin(info);
    }
  }, [is]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    showMessage(t2("logout"), "info");
    await logout();
    setIsLogin(null);
    removeTokensFromLocalStorage();
    router.push(`/${locale}/login`);
    handleClose();
    showMessage(t2("logged out"), "success");
  };

  return (
    <Box
      sx={{
        marginRight: "10px",
      }}
    >
      {isLogin ? (
        <>
          <Avatar
            //@ts-ignore
            src={isLogin.avatar} // Thay đổi đường dẫn này đến ảnh avatar của người dùng
            onClick={handleClick}
            sx={{ cursor: "pointer", marginRight: "5px" }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            disablePortal
            disableEnforceFocus
          >
            {infoUser && [
              <MenuItem key="fullName" sx={{ pointerEvents: "none" }}>
                <Typography variant="body1" fontWeight="bold">
                  {infoUser.fullName || "Unknown Name"}
                </Typography>
              </MenuItem>,
              <MenuItem key="username" sx={{ pointerEvents: "none" }}>
                <Typography variant="body2">
                  {infoUser.username || "unknown_username"}
                </Typography>
              </MenuItem>,
              <Divider key="divider" />,
            ]}
            <Link href={"/profile"}>
              <MenuItem onClick={handleClose}>
                {t("header-menu-thong-tin-ca-nhan")}
              </MenuItem>
            </Link>
            <Link href={"/payment/history"}>
              <MenuItem onClick={handleClose}>
                {" "}
                {t("header-menu-lich-su-giao-dich")}
              </MenuItem>
            </Link>
            {infoUser?.singerId && (
              <Link href={"/songs/managerSong"}>
                <MenuItem onClick={handleClose}>
                  {t("header-menu-quan-ly-bai-hat")}
                </MenuItem>
              </Link>
            )}
            {infoUser?.type == "SYSTEM" && (
              <Link href={"/profile/change-password"}>
                <MenuItem onClick={handleClose}>
                  {t("header-menu-doi-mat-khau")}
                </MenuItem>
              </Link>
            )}

            <MenuItem sx={{ color: "red" }} onClick={handleLogout}>
              {t("header-menu-dang-xuat")}
              <LogoutIcon sx={{ marginLeft: "10px", fontSize: "16px" }} />
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          onClick={() => router.push(`/${locale}/login`)}
          variant="outlined"
          sx={{ marginRight: "5px" }}
        >
          {t("header-loggin")}
        </Button>
      )}
    </Box>
  );
}
