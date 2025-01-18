import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import { ThemeProvider } from "@/app/theme-provider";
import "@/app/globals.css";
export default function RedirectLoginGoogleLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript defaultMode="system" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
