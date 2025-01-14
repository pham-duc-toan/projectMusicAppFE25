import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|vi)/:path*"], // Áp dụng middleware cho các đường dẫn được hỗ trợ
};
