"use client";
import * as React from "react";
import { styled, Theme, CSSObject, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

import HomeIcon from "@mui/icons-material/Home";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Skeleton } from "@mui/material";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MicIcon from "@mui/icons-material/Mic";
import TopicIcon from "@mui/icons-material/Topic";
import ItemSider from "./component/item-of-list-button-sider";
import { useTranslations } from "next-intl";
const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Sider = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
  "& .MuiPaper-root": {
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
  },
  "[data-mui-color-scheme='dark'] & .MuiPaper-root": {
    background: "#1b0c35",
  },
  "[data-mui-color-scheme='light'] & .MuiPaper-root": {
    background: "#f2f2f2",
  },
}));

const SideBarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...theme.mixins.toolbar,
}));

export default function SiderComponent({ open }: { open: boolean }) {
  const theme: Theme = useTheme();
  const [linkImg, setLinkImg] = React.useState("");
  const t = useTranslations("Layout");
  React.useEffect(() => {
    const logoSrc = open
      ? theme.palette.mode === "dark"
        ? "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733298068/pyokmt6ltmcq3w97dihh.png" // Hình ảnh cho dark mode khi mở
        : "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733298357/nfzbp6jdilxcnivcphoh.png" // Hình ảnh cho light mode khi mở
      : "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733296299/xnwsxfhvkgsy3njpsyat.png"; // Hình ảnh khi không mở
    setLinkImg(logoSrc);
  }, [open, theme]);
  return (
    <Sider variant="permanent" open={open}>
      <SideBarHeader>
        <Link href={"/"}>
          {linkImg !== "" ? (
            <Image
              src={linkImg || ""}
              width={open ? 100 : 56}
              height={56}
              alt="SideBar Header"
              objectFit="cover" // Đảm bảo ảnh phủ toàn bộ diện tích của vùng chứa
              objectPosition="center"
              loading="lazy" // Lazy load ảnh
            />
          ) : (
            // Skeleton là hiệu ứng loading thay thế cho ảnh đang tải
            <Skeleton
              variant="rectangular"
              width={open ? 100 : 56}
              height={56}
            />
          )}
        </Link>
      </SideBarHeader>
      <Divider />
      <List sx={{ padding: 0 }}>
        <ItemSider
          open={open}
          data={{
            name: t("sider-home"),
            router: "/",
          }}
        >
          <HomeIcon />
        </ItemSider>
        <ItemSider
          open={open}
          data={{
            name: t("sider-playlist"),
            router: "/playList",
          }}
        >
          <PlaylistPlayIcon />
        </ItemSider>

        <ItemSider
          open={open}
          data={{
            name: t("sider-favorite-songs"),
            router: "/songs/my-favorite-song",
          }}
        >
          <FavoriteIcon />
        </ItemSider>
      </List>
      <Divider />
      <List sx={{ padding: 0 }}>
        <ItemSider
          open={open}
          data={{
            name: t("sider-songs"),
            router: "/songs",
          }}
        >
          <QueueMusicIcon />
        </ItemSider>
        <ItemSider
          open={open}
          data={{
            name: t("sider-singer"),
            router: "/singers",
          }}
        >
          <MicIcon />
        </ItemSider>
        <ItemSider
          open={open}
          data={{
            name: t("sider-topic"),
            router: "/topics",
          }}
        >
          <TopicIcon />
        </ItemSider>
      </List>
    </Sider>
  );
}
