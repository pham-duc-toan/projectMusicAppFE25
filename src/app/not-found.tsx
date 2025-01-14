import { routing } from "@/i18n/routing";
import NotFoundPage from "./[locale]/not-found";
import NextTopLoader from "nextjs-toploader";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import { ThemeProvider } from "./theme-provider";

// This page renders when a route like `/unknown.txt` is requested.
// In this case, the layout at `app/[locale]/layout.tsx` receives
// an invalid value as the `[locale]` param and calls `notFound()`.

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
