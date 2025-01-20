import LayOutBasic from "../partial/LayOutBasic/LayoutBasic";
import RefreshToken from "@/component/refresh-token";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <RefreshToken />
      <LayOutBasic>{children}</LayOutBasic>
    </>
  );
}
