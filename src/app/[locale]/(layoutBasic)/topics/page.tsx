import { apiBasicServer } from "@/app/utils/request";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { getTranslations } from "next-intl/server";
import ItemControlCardTopic from "./components/ItemControlCardTopic ";

interface Topic {
  id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
  songsCount: number;
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.exploreAllTopics",
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
const AllTopics = async () => {
  const t = await getTranslations("allTopics"); // Dùng getTranslations() cho Server Component

  // Gọi API để lấy danh sách tất cả các topic
  const datall: any = await apiBasicServer(
    "GET",
    "/topics/client", // Endpoint lấy danh sách topic
    { sort: "-createdAt" },
    undefined,
    undefined,
    ["revalidate-tag-topics", "revalidate-tag-songs"]
  );

  const datas = datall?.data || []; // Lấy dữ liệu topic từ API

  return (
    <>
      <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>{t("title")}</h1>
      <Grid container>
        {datas.length > 0 ? (
          datas.map((data: Topic, index: number) => (
            <Grid md={4} sm={6} xs={12} key={index}>
              <Box sx={{ padding: "10px" }}>
                <ItemControlCardTopic data={data} />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box textAlign="center" mt={4}>
              <h3>{t("noTopics")}</h3>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AllTopics;
