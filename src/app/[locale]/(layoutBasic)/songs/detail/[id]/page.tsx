import { Metadata } from "next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import { getTranslations } from "next-intl/server";
import { apiBasicServer, getInfoUser } from "@/app/utils/request";

import PlayerControls from "./components/PlayerControls";
import Lyric from "./components/lyric";
import FavoriteButton from "@/component/iconbutton/IconLikeSong";
import IconAddToPlayList from "@/component/iconbutton/IconAddToPlayList";

import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";

import SingerInfoPopover from "./components/SingerInfo";
import TopicPopover from "./components/TopicInfo";

interface SongDetail {
  listen: number;
  id: string;
  title: string;
  avatar: string;
  description: string;
  singer: {
    id: string;
    fullName: string;
    avatar: string;
    status: string;
    slug: string;
    deleted: boolean;
    updatedAt: string;
    createdAt: string;
  };
  topic: {
    id: string;
    title: string;
    avatar: string;
    description: string;
    status: string;
    slug: string;
    deleted: boolean;
  };
  like: number;
  lyrics: string;
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}) {
  try {
    const response = await apiBasicServer(
      "GET",
      `/songs/detail/${params.id}`,
      undefined,
      undefined,
      undefined,
      ["revalidate-tag-songs"]
    );
    const data: SongDetail = response?.data;

    // Kiểm tra nếu response hợp lệ
    const title = data?.title || "Unknown Song";
    const description = data?.description || "No description available.";
    const image =
      data?.avatar ||
      "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733296299/xnwsxfhvkgsy3njpsyat.png";

    return {
      title: title + " | Music App Toandeptrai",
      description,
      openGraph: {
        title,
        description,
        images: [image],
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Error - Music App",
      description: "An error occurred while fetching song details.",
      openGraph: {
        title: "Error - Music App",
        description: "An error occurred while fetching song details.",
        images: [
          "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733296299/xnwsxfhvkgsy3njpsyat.png",
        ],
        type: "website",
      },
    };
  }
}

// Fetch data server-side (SSR)
async function fetchSongDetail(id: string): Promise<SongDetail | null> {
  try {
    const response = await apiBasicServer(
      "GET",
      `/songs/detail/${id}`,
      undefined,
      undefined,
      undefined,
      ["revalidate-tag-songs"]
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching song detail:", error);
    return null;
  }
}

// Page component
const SongDetailPage = async ({ params }: { params: { id: string } }) => {
  const t = await getTranslations("SongDetailPage"); // Sử dụng getTranslations() cho Server Component
  const { id } = params;
  const songDetail = await fetchSongDetail(id);
  const access_token = GetPublicAccessTokenFromCookie();
  let favoriteSongs = [];
  if (access_token) {
    const dataFs = await getInfoUser(access_token.value);
    favoriteSongs =
      dataFs?.data?.listFavoriteSong.map((song: any) => song.id) || [];
  }

  if (!songDetail) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {t("notFound")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      {/* Ảnh và tiêu đề bài hát */}
      <Box
        display="flex"
        justifyContent={"space-between"}
        padding={"20px"}
        boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}
        marginBottom={"20px"}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={songDetail.avatar}
            alt={songDetail.title}
            sx={{ width: 100, height: 100, mr: 2 }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {songDetail.title}
            </Typography>
            <SingerInfoPopover singer={songDetail.singer} />
            <TopicPopover topicDetail={songDetail.topic} />
          </Box>
        </Box>
        <Box>
          <FavoriteButton fSongs={favoriteSongs} songId={songDetail.id} />
          <IconAddToPlayList fSongs={favoriteSongs} songId={songDetail.id} />
          <PlayerControls songDetail={songDetail} />
        </Box>
      </Box>

      {/* Lượt nghe và lượt thích */}
      <Box display="flex" gap={4} mb={2}>
        <Typography variant="subtitle2">
          <strong>{t("listenCount")}:</strong> {songDetail.listen}
        </Typography>
        <Typography variant="subtitle2">
          <strong>{t("likeCount")}:</strong> {songDetail.like}
        </Typography>
      </Box>

      {/* Lời bài hát */}
      <Typography variant="body1">
        <strong>{t("lyrics")}:</strong>
      </Typography>
      <Box
        className="lyrics-container"
        sx={{
          minHeight: songDetail.lyrics ? "auto" : "300px",
          maxHeight: "300px",
          overflowY: songDetail.lyrics ? "auto" : "hidden",
          display: "flex",
          justifyContent: songDetail.lyrics ? "flex-start" : "center",
          alignItems: songDetail.lyrics ? "flex-start" : "center",
          textAlign: "center",
        }}
      >
        {songDetail.lyrics ? (
          <Typography
            className="lyrics-content"
            variant="body2"
            whiteSpace="pre-line"
            component="div"
          >
            <Lyric songId={songDetail.id} lyrics={songDetail.lyrics} />
          </Typography>
        ) : (
          <Typography
            variant="body2"
            whiteSpace="pre-line"
            fontStyle="italic"
            sx={{
              color: "#1b0c35",
            }}
          >
            {t("noLyrics")}
          </Typography>
        )}
      </Box>

      <Box gap={4} mt={2}>
        <Typography variant="body1" mb={2}>
          <strong>{t("descriptionLabel")}:</strong>
        </Typography>
        {songDetail.description ? (
          <Typography variant="body1">{songDetail.description}</Typography>
        ) : (
          <Typography variant="body2" fontStyle="italic">
            {t("noDescription")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SongDetailPage;
