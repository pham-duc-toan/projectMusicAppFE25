import { CssBaseline } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
