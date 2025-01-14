import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import {
  apiBasicClient,
  apiBasicServer,
  getInfoUser,
} from "@/app/utils/request";
import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";
import ItemControlCard from "@/component/item-control-card-music";

// Định nghĩa kiểu dữ liệu của ca sĩ
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

// Hàm server-side để lấy dữ liệu
async function getSingerDetail(id: string): Promise<ISingerDetail | null> {
  try {
    const response = await apiBasicServer("GET", `/singers/detailClient/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch singer details:", error);
    return null;
  }
}

// Component trang chi tiết ca sĩ
export default async function SingerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const singerDetail = await getSingerDetail(params.id);

  if (!singerDetail) {
    return (
      <Typography
        color="primary"
        sx={{ textAlign: "center", marginTop: "20px" }}
      >
        Không thể tải thông tin ca sĩ.
      </Typography>
    );
  }
  const datall: any = await apiBasicServer(
    "GET",
    `/songs/song-of-singer/${singerDetail?._id}`,
    undefined,
    undefined,
    undefined,
    ["revalidate-tag-songs", "revalidate-tag-singers"]
  );

  const datas = datall?.data || undefined;

  let favoriteSongs = [];
  const access_token = GetPublicAccessTokenFromCookie();

  if (access_token) {
    const dataFs = await getInfoUser(access_token.value);
    favoriteSongs =
      dataFs.data.listFavoriteSong.map((song: any) => song._id) || [];
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <Avatar
          src={singerDetail.avatar}
          alt={singerDetail.fullName}
          sx={{ width: 120, height: 120, marginBottom: "10px" }}
        />
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>
          {singerDetail.fullName}
        </Typography>

        <Typography variant="body2" sx={{ marginBottom: "10px" }}>
          <strong>Tham gia vào:</strong>{" "}
          {new Date(singerDetail.createdAt).toLocaleString("vi-VN")}
        </Typography>
      </Paper>
      <Grid container spacing={2}>
        {datas && datas.length > 0 ? (
          datas.map((data: any, index: number) => {
            return (
              <Grid item md={4} sm={6} xs={12} key={index}>
                <Box sx={{ padding: "10px" }}>
                  <ItemControlCard fSongs={favoriteSongs} data={data} />
                </Box>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                marginTop: "20px",
                fontStyle: "italic",
              }}
            >
              Không có bài hát.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
