import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";

import { TSongDetail } from "@/dataType/song";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Slider from "./components/slider";
import ButtonListenNow from "./components/buttonListenNow";
import { apiBasicServer } from "@/app/utils/request";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import SingerInfo from "./components/infoSinger";

interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
  songsCount: number;
}
interface ISingerDetail {
  _id: string;
  fullName: string;
  avatar: string;
  status: string;
  slug: string;
  deleted: boolean;
  updatedAt: string;
  createdAt: string;
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
    "/singers",
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
            {t("bxh")}
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
              Xem Top 100 bài hát
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
            Có thể bạn muốn nghe
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
              Xem thêm
            </Typography>
          </Link>
        </Box>
      )}

      <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
        {songsForYou.map((song: TSongDetail, index: number) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Link href={`/songs/detail/${song.slug}`}>
              <Card sx={{ height: "400px" }}>
                <CardMedia
                  component="img"
                  image={song.avatar}
                  alt={song.title}
                  sx={{
                    borderRadius: "4px",
                    objectFit: "cover",
                    // width: "200px",
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
                          //combo hien thi 3 cham
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          wordWrap: "break-word",
                        }}
                      >
                        {song.title}
                      </Typography>
                      <SingerInfo singer={song.singerId} />
                    </Box>

                    <ButtonListenNow song={song} />
                  </Box>
                </Box>
              </Card>
            </Link>
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
            Mới phát hành
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
              Xem thêm
            </Typography>
          </Link>
        </Box>
      )}

      <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
        {newSong.map((song: TSongDetail, index: number) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Link href={`/songs/detail/${song.slug}`}>
              <Card sx={{ height: "400px" }}>
                <CardMedia
                  component="img"
                  image={song.avatar}
                  alt={song.title}
                  sx={{
                    borderRadius: "4px",
                    objectFit: "cover",
                    // width: "200px",
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
                          //combo hien thi 3 cham
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          wordWrap: "break-word",
                        }}
                      >
                        {song.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          //combo hien thi 3 cham
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          wordWrap: "break-word",
                        }}
                      >
                        <SingerInfo singer={song.singerId} />
                      </Typography>
                    </Box>
                    <ButtonListenNow song={song} />
                  </Box>
                </Box>
              </Card>
            </Link>
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
            Những Chủ Đề Mới Nhất
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
                  color: "primary.main", // Màu khi hover
                  cursor: "pointer", // Thêm hiệu ứng con trỏ tay khi hover
                },
              }}
            >
              <KeyboardArrowLeftIcon />
              Xem thêm
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
                {/* Hình ảnh full chiều rộng và chiều cao */}
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

                {/* Nội dung tiêu đề và mô tả */}
                <Box
                  sx={{
                    padding: "10px",
                  }}
                >
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
                    {topic.description || "Mô tả đang được cập nhật"}
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
            Nghệ Sĩ Nổi Bật
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
                    {/* Ảnh tròn */}
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

                    {/* Tên nghệ sĩ */}
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

                    {/* Vai trò hoặc mô tả */}
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: "5px",
                      }}
                    >
                      {"Nghệ sĩ"}
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
