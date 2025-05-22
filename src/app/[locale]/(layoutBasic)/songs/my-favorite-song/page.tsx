import { getInfoUser } from "@/app/utils/request";
import ItemControlCard from "@/component/item-control-card-music";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.myFavoriteSongs",
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
const MyFavoriteSong = async () => {
  const t = await getTranslations("myFavoriteSongPage"); // Dùng getTranslations cho async component

  let favoriteSongs = [];
  let fullInfoFavoriteSongs = [];
  const access_token = GetPublicAccessTokenFromCookie();

  if (access_token) {
    const dataFs = await getInfoUser(access_token.value);
    if (dataFs?.data?.listFavoriteSong) {
      favoriteSongs = dataFs.data.listFavoriteSong.map((song: any) => song.id);
      fullInfoFavoriteSongs = dataFs.data.listFavoriteSong;
    } else {
      console.error("API không có listFavoriteSong:", dataFs);
      favoriteSongs = [];
      fullInfoFavoriteSongs = [];
    }
  }

  return (
    <>
      <Typography variant="h4" sx={{ marginBottom: "30px", marginTop: "40px" }}>
        {t("likedSongs")}
      </Typography>
      {!fullInfoFavoriteSongs || fullInfoFavoriteSongs.length === 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "50vh" }} // Căn giữa theo chiều dọc
        >
          <Typography
            variant="h6"
            style={{ fontStyle: "italic", color: "text.primary" }}
          >
            {t("noFavoriteSongs")}
          </Typography>
        </Grid>
      ) : (
        <Grid container>
          {fullInfoFavoriteSongs.map((data: any, index: number) => (
            <Grid item md={4} sm={6} xs={12} key={index}>
              <Box sx={{ padding: "10px" }}>
                <ItemControlCard fSongs={favoriteSongs} data={data} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};
export default MyFavoriteSong;
