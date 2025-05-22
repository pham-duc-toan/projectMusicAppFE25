import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import { apiBasicServer } from "@/app/utils/request";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { redirect } from "next/navigation";
import CreatePlaylistButton from "./components/createPlayListButton";
import PlaylistItem from "./components/PlaylistItem";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.myPlaylists",
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
const Playlists = async () => {
  const t = await getTranslations("playlist"); // Load translations
  const access_token = GetAccessTokenFromCookie();

  const datall: any = await apiBasicServer(
    "GET",
    "/playlists/detail",
    undefined,
    undefined,
    access_token,
    ["revalidate-tag-list-playlist"]
  );
  const datas = datall?.data || undefined;
  if (!datas && datall.redirect) {
    redirect("/login");
  }

  interface SongState {
    id: string;
    title: string;
    avatar: string;
    audio: string;
    singer: {
      id: string;
      fullName: string;
      [key: string]: any;
    };
    like: number;
    slug: string;
  }
  interface Playlist {
    id: string;
    title: string;
    listSong: Array<SongState>;
    [key: string]: any;
  }
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          marginBottom: "30px",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t("title")}
        </Typography>
        <CreatePlaylistButton />
      </Box>
      {!datas || datas.length === 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "50vh" }} // Đặt chiều cao để căn giữa theo chiều dọc
        >
          <Typography
            variant="h6"
            style={{ fontStyle: "italic", color: "text.primary" }}
          >
            {t("noPlaylists")}
          </Typography>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {datas.map((playlist: Playlist, index: any) => (
            <Grid item md={4} sm={6} xs={12} key={index}>
              <PlaylistItem playlist={playlist} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
export default Playlists;
