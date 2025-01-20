import "../globals.css";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import { ThemeProvider } from "../theme-provider";
import ContextApp from "@/context-app";
import NextTopLoader from "nextjs-toploader";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import OrientationGuard from "./OrientationGuard";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.layout",
  });

  return {
    title: `${t("detailTitle")}`,
    description: t("detailDescription"),
    openGraph: {
      title: t("detailTitle"),
      description: t("detailDescription"),
      images: [
        "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733296299/xnwsxfhvkgsy3njpsyat.png",
      ],
      type: "website",
    },
  };
}
export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}
export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Kiểm tra nếu `locale` không hợp lệ
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Lấy messages tương ứng với locale
  const messages = await getMessages(locale as any);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextTopLoader
          color="#8479F2"
          initialPosition={0.08}
          height={3}
          zIndex={9999}
          showSpinner={false}
        />
        <InitColorSchemeScript defaultMode="system" />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ContextApp>
              <OrientationGuard>{children}</OrientationGuard>
            </ContextApp>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
