"use client";
import { checkAndRefreshToken } from "@/app/utils/checkAndRefreshToken";
import { useAppContext } from "@/context-app";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login", "/logout"];
export default function RefreshToken() {
  const { showMessage } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push(`/login`);
      },
    });
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 5000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            showMessage(
              "Hết phiên đăng nhập! Vui lòng đăng nhập lại!",
              "error"
            );
            router.push(`/login`);
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);
  return null;
}
