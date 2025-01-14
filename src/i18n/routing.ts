import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "vi"], // Các ngôn ngữ hỗ trợ
  defaultLocale: "en", // Ngôn ngữ mặc định
});

// Cung cấp các API điều hướng hỗ trợ i18n
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
export const locales = routing.locales;
