import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

import { TSongDetail } from "@/dataType/song";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import Slider from "./components/slider";
import ButtonListenNow from "./components/buttonListenNow";
import { apiBasicServer } from "@/app/utils/request";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import SingerInfo from "./components/infoSinger";
import { Metadata } from "next";

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
interface ISingerDetail {
  id: string;
  fullName: string;
  avatar: string;
  status: string;
  slug: string;
  deleted: boolean;
  updatedAt: string;
  createdAt: string;
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.home",
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

export default async function Dashboard() {
  const t = await getTranslations("HomePage");
  const resSFY = await apiBasicServer(
    "GET",
    "/song-for-you/client",
    { limit: 6 },
    undefined,
    undefined,
    ["revalidate-tag-song-for-you"]
  );
  const resNs = await apiBasicServer(
    "GET",
    "/songs",
    { limit: 6 },
    undefined,
    undefined,
    ["revalidate-tag-songs"]
  );
  const resTop = await apiBasicServer(
    "GET",
    "/songs",
    {
      limit: 6,
      sort: "-listen",
    },
    undefined,
    undefined,
    ["revalidate-tag-songs"]
  );
  const resTopic = await apiBasicServer(
    "GET",
    "/topics",
    { limit: 6, sort: "-createdAt" },
    undefined,
    undefined,
    ["revalidate-tag-topics"]
  );
  const resSinger = await apiBasicServer(
    "GET",
    "/singers/client",
    { limit: 6 },
    undefined,
    undefined,
    ["revalidate-tag-topics"]
  );
  const topics = resTopic?.data || [];

  const singers = resSinger?.data || [];

  const topSong = resTop?.data?.data || [];
  const newSong = resNs?.data?.data || [];
  const songsForYou = resSFY?.data?.listSong || [];

  return (
    <Box
      sx={{
        marginTop: "0px",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      {topSong.length > 0 && (
        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 700 }} variant="h4">
            {t("topSongs")}
          </Typography>
          <Link href={"/songs/bxh"}>
            <Button
              sx={{
                transition: "all 0.3s ease-in-out",
                backgroundColor: "transparent",
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "primary.main",
                  color: "white",
                  borderColor: "primary.main",
                },
              }}
              variant="outlined"
            >
              {t("viewTop100")}
            </Button>
          </Link>
        </Box>
      )}

      <Slider topSong={topSong} />
      {songsForYou.length > 0 && (
        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="h5">
            {t("songsForYou")}
          </Typography>
          <Link href="/songs">
            <Typography
              display="flex"
              alignItems="center"
              variant="body1"
              color="GrayText"
              fontWeight={"700"}
              sx={{
                "&:hover": {
                  color: "primary.main", // Màu khi hover
                  cursor: "pointer", // Thêm hiệu ứng con trỏ tay khi hover
                },
              }}
            >
              <KeyboardArrowLeftIcon />
              {t("seeMore")}
            </Typography>
          </Link>
        </Box>
      )}

      <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
        {songsForYou.map((song: TSongDetail, index: number) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card sx={{ height: "400px" }}>
              <CardMedia
                component="img"
                image={song.avatar}
                alt={song.title}
                sx={{
                  borderRadius: "4px",
                  objectFit: "cover",
                  height: "200px",
                }}
              />
              <Box height={"200px"} padding={"20px"}>
                <Box
                  display={"flex"}
                  sx={{
                    height: "100%",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      <Link href={`/songs/detail/${song.slug}`}>
                        {song.title}
                      </Link>
                    </Typography>
                    <SingerInfo singer={song.singer} />
                  </Box>

                  <ButtonListenNow song={song} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {newSong.length > 0 && (
        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="h5">
            {t("newReleases")}
          </Typography>
          <Link href="/songs">
            <Typography
              display="flex"
              alignItems="center"
              variant="body1"
              color="GrayText"
              fontWeight={"700"}
              sx={{
                "&:hover": {
                  color: "primary.main", // Màu khi hover
                  cursor: "pointer", // Thêm hiệu ứng con trỏ tay khi hover
                },
              }}
            >
              <KeyboardArrowLeftIcon />
              {t("seeMore")}
            </Typography>
          </Link>
        </Box>
      )}

      <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
        {newSong.map((song: TSongDetail, index: number) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card sx={{ height: "400px" }}>
              <CardMedia
                component="img"
                image={song.avatar}
                alt={song.title}
                sx={{
                  borderRadius: "4px",
                  objectFit: "cover",
                  height: "200px",
                }}
              />
              <Box height={"200px"} padding={"20px"}>
                <Box
                  display={"flex"}
                  sx={{
                    height: "100%",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        wordWrap: "break-word",
                      }}
                    >
                      <Link href={`/songs/detail/${song.slug}`}>
                        {song.title}
                      </Link>
                    </Typography>

                    <SingerInfo singer={song.singer} />
                  </Box>
                  <ButtonListenNow song={song} />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {topics.length > 0 && (
        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="h5">
            {t("latestTopics")}
          </Typography>
          <Link href="/topics">
            <Typography
              display="flex"
              alignItems="center"
              variant="body1"
              color="GrayText"
              fontWeight={"700"}
              sx={{
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
            >
              <KeyboardArrowLeftIcon />
              {t("seeMore")}
            </Typography>
          </Link>
        </Box>
      )}

      <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
        {topics.map((topic: Topic, index: number) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Link href={`/topics/detail/${topic.slug}`}>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardMedia
                  component="img"
                  image={topic.avatar}
                  alt={topic.title}
                  sx={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ padding: "10px" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {topic.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      marginTop: "5px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {topic.description || t("descriptionUpdating")}
                  </Typography>
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>

      {singers.length > 0 && (
        <Box sx={{ marginBottom: "20px" }}>
          <Typography
            sx={{ fontWeight: 600, marginBottom: "20px" }}
            variant="h5"
          >
            {t("featuredSingers")}
          </Typography>

          <Grid container spacing={4}>
            {singers.map((singer: ISingerDetail, index: number) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Link href={`/singers/detailSinger/${singer.slug}`}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: "background.default",
                      padding: "20px",
                      borderRadius: "12px",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginBottom: "10px",
                        border: "3px solid white",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={singer.avatar}
                        alt={singer.fullName}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {singer.fullName}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: "5px",
                      }}
                    >
                      {t("artist")}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
