import type { Metadata } from "next";
import RefreshToken from "@/component/refresh-token";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <RefreshToken />
      {children}
    </>
  );
}
