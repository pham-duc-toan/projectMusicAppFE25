import { apiBasicServer } from "@/app/utils/request";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import ItemControlCardSinger from "./components/ItemControlCardSinger";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.exploreAllSingers",
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
const AllSingers = async () => {
  const t = await getTranslations("AllSingers");

  // Gọi API để lấy danh sách tất cả ca sĩ
  const datall: any = await apiBasicServer(
    "GET",
    "/singers/client", // Endpoint lấy danh sách ca sĩ
    { sort: "-createdAt" },
    undefined,
    undefined,
    ["revalidate-tag-singers", "revalidate-tag-songs"]
  );

  const datas = datall?.data || []; // Lấy dữ liệu ca sĩ từ API

  return (
    <>
      <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>{t("title")}</h1>
      <Grid container>
        {datas.length > 0 ? (
          datas.map((data: any, index: number) => (
            <Grid md={4} sm={6} xs={12} key={index}>
              <Box sx={{ padding: "10px" }}>
                {/* Hiển thị thông tin ca sĩ */}
                <ItemControlCardSinger data={data} />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
              {t("noSingers")}
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AllSingers;
