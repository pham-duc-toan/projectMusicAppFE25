"use client";
import { Link } from "@/i18n/routing";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import { usePathname } from "next/navigation"; // Dùng usePathname thay vì useRouter

interface I {
  open: boolean;
  children: React.ReactNode;
  data: {
    router: string;
    name: string;
  };
}

const ItemSider = (props: I) => {
  const { open, data, children } = props;
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  const isActive = pathname.substring(3) === data.router;

  return (
    <ListItem
      disablePadding
      sx={{
        display: "block",
        color: isActive ? "secondary.A700" : "secondary.A400",
      }}
    >
      <Link href={`${data.router}`}>
        <Tooltip title={!open ? data.name : ""} placement="right" arrow>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
                color: isActive ? "secondary.A700" : "secondary.A400",
              }}
            >
              {children}
            </ListItemIcon>
            <ListItemText
              primary={`${data.name}`}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </Tooltip>
      </Link>
    </ListItem>
  );
};

export default ItemSider;
