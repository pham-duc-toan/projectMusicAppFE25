import { getTranslations } from "next-intl/server";
import PermissionPage from "./components/PermissionPage";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.rolesPermissions",
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
export default function Permissions() {
  return <PermissionPage />;
}
