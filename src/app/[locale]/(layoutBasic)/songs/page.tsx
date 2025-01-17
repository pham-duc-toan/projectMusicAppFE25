import { apiBasicServer, getInfoUser } from "@/app/utils/request";
import ItemControlCard from "@/component/item-control-card-music";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";
import PaginationComponent from "@/component/PaginationComponent";
import { getTranslations } from "next-intl/server";

interface SongsProps {
  searchParams: { page?: string }; // Lấy query `page` từ URL
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
      dataFs.data.listFavoriteSong.map((song: any) => song._id) || [];
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
