import NotFoundPage from "./[locale]/not-found";
import NextTopLoader from "nextjs-toploader";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import { ThemeProvider } from "./theme-provider";

export default function GlobalNotFound() {
  return (
    <html lang={"en"} suppressHydrationWarning>
      <body>
        <NextTopLoader
          color="#8479F2"
          initialPosition={0.08}
          height={3}
          zIndex={9999}
          showSpinner={false}
        />
        <InitColorSchemeScript defaultMode="system" />

        <ThemeProvider>
          <NotFoundPage />
        </ThemeProvider>
      </body>
    </html>
  );
}
