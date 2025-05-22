import { apiBasicServer, getInfoUser } from "@/app/utils/request";
import ItemControlCard from "@/component/item-control-card-music";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";
import PaginationComponent from "@/component/PaginationComponent";

import { getTranslations } from "next-intl/server";

interface SongsProps {
  searchParams: { page?: string }; // Lấy query `page` từ URL
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.exploreAllSongs",
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
const Songs = async ({ searchParams }: SongsProps) => {
  const t = await getTranslations("songsPage"); // Dùng getTranslations cho async component
  const limitItem = 12;

  // Lấy giá trị `currentPage` từ query string (mặc định là 1 nếu không có)
  const currentPage = parseInt(searchParams?.page || "1", 10);

  // Gọi API để lấy danh sách bài hát
  const datall: any = await apiBasicServer(
    "GET",
    "/songs/",
    { limit: limitItem, skip: (currentPage - 1) * limitItem },
    undefined,
    undefined,
    ["revalidate-tag-songs"]
  );

  const datas = datall?.data.data || [];
  const totalPages = Math.ceil(datall?.data.total / limitItem);

  let favoriteSongs = [];
  const access_token = GetPublicAccessTokenFromCookie();

  if (access_token) {
    const dataFs = await getInfoUser(access_token.value);
    favoriteSongs =
      dataFs.data.listFavoriteSong.map((song: any) => song.id) || [];
  }

  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "30px", marginTop: "40px" }}>
        {t("allSongs")}
      </Typography>
      <Grid container>
        {datas.map((data: any, index: number) => (
          <Grid md={4} sm={6} xs={12} key={index}>
            <Box sx={{ padding: "10px" }}>
              <ItemControlCard fSongs={favoriteSongs} data={data} />
            </Box>
          </Grid>
        ))}
      </Grid>
      {/* Thêm component phân trang */}
      <Box mt={4}>
        <PaginationComponent totalPages={totalPages} />
      </Box>
    </>
  );
};

export default Songs;
