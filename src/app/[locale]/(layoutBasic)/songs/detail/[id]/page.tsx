import { Metadata } from "next";
import { apiBasicServer, getInfoUser } from "@/app/utils/request";
import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import PlayerControls from "./components/PlayerControls";
import Lyric from "./components/lyric";
import FavoriteButton from "@/component/iconbutton/IconLikeSong";
import IconAddToPlayList from "@/component/iconbutton/IconAddToPlayList";
import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";

export const metadata: Metadata = {
  title: "Chi tiết bài hát",
  description: "Thông tin chi tiết về bài hát",
};

interface SongDetail {
  listen: number;
  _id: string;
  title: string;
  avatar: string;
  description: string;
  singerId: {
    _id: string;
    fullName: string;
  };
  topicId: {
    _id: string;
    title: string;
  };
  like: number;
  lyrics: string;
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
  const { id } = params;
  const songDetail = await fetchSongDetail(id);
  const access_token = GetPublicAccessTokenFromCookie();
  let favoriteSongs = [];
  if (access_token) {
    const dataFs = await getInfoUser(access_token.value);
    favoriteSongs =
      dataFs.data.listFavoriteSong.map((song: any) => song._id) || [];
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
          Không tìm thấy bài hát
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
            <Typography variant="subtitle1" color="text.secondary">
              Ca sĩ: {songDetail.singerId?.fullName || "Không rõ ca sĩ"}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Chủ đề: {songDetail.topicId?.title || "Không rõ thể loại"}
            </Typography>
          </Box>
        </Box>
        <Box>
          <FavoriteButton fSongs={favoriteSongs} songId={songDetail._id} />
          <IconAddToPlayList fSongs={favoriteSongs} songId={songDetail._id} />
          <PlayerControls songDetail={songDetail} />
        </Box>
      </Box>

      {/* Lượt nghe và lượt thích */}
      <Box display="flex" gap={4} mb={2}>
        <Typography variant="subtitle2">
          <strong>Lượt nghe:</strong> {songDetail.listen}
        </Typography>
        <Typography variant="subtitle2">
          <strong>Lượt thích:</strong> {songDetail.like}
        </Typography>
      </Box>

      {/* Lời bài hát */}
      <Typography variant="body1">
        <strong>Lời bài hát:</strong>
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
            variant="body2"
            whiteSpace="pre-line"
            className="lyrics-content"
            component="div"
          >
            <Lyric songId={songDetail._id} lyrics={songDetail.lyrics} />
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
            Chưa cập nhật lời cho bài hát
          </Typography>
        )}
      </Box>

      <Box gap={4} mt={2}>
        <Typography variant="body1" mb={2}>
          <strong>Mô tả:</strong>
        </Typography>
        {songDetail.description ? (
          <Typography variant="body1">{songDetail.description}</Typography>
        ) : (
          <Typography variant="body2" fontStyle="italic">
            Chưa cập nhật mô tả cho bài hát
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SongDetailPage;
