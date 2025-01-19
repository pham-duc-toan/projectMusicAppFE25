"use client";

import { useLocale } from "next-intl";

import { useTransition, useState } from "react";

import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import TranslateIcon from "@mui/icons-material/Translate";
import DoneIcon from "@mui/icons-material/Done";

import { locales, usePathname, useRouter } from "@/i18n/routing"; // Nhập danh sách locales từ routing.ts
import { useTranslations } from "next-intl";

import { SelectChangeEvent } from "@mui/material/Select";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const localeActive = useLocale();
  const t = useTranslations("language"); // Hook dịch của next-intl
  const pathname = usePathname();
  const params = useParams();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const onSelectChange = (e: SelectChangeEvent<string>) => {
    const nextLocale = e.target.value; // Kiểu value là string
    startTransition(() => {
      router.replace(
        {
          pathname,
          //@ts-ignore
          params,
        },
        { locale: nextLocale }
      );
    });
    handleMenuClose(); // Đóng menu sau khi thay đổi ngôn ngữ
  };

  return (
    <div>
      <FormControl sx={{ marginLeft: "15px" }} variant="outlined" size="small">
        <IconButton
          onClick={handleMenuOpen}
          disabled={isPending} // Vô hiệu hóa icon khi đang chuyển đổi ngôn ngữ
        >
          <TranslateIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          PaperProps={{
            sx: {
              maxHeight: 200, // Giới hạn chiều cao của menu
            },
          }}
        >
          {locales.map((locale) => (
            <MenuItem
              key={locale}
              value={locale}
              selected={locale === localeActive}
              onClick={() =>
                onSelectChange({
                  target: { value: locale },
                } as SelectChangeEvent<string>)
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {t(locale)}
              <DoneIcon
                sx={{
                  marginLeft: "10px",
                  display: locale === localeActive ? "block" : "none",
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </FormControl>
    </div>
  );
}
