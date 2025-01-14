import { Box, Typography, Avatar, Paper, Grid } from "@mui/material";
import { apiBasicServer, getInfoUser } from "@/app/utils/request";
import ItemControlCard from "@/component/item-control-card-music";
import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";

// Định nghĩa kiểu dữ liệu của topic
interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}

// Hàm server-side để lấy dữ liệu
async function getTopicDetail(id: string): Promise<Topic | null> {
  try {
    const response = await apiBasicServer(
      "GET",
      `/topics/detail/${id}`,
      undefined,
      undefined,
      undefined,
      ["revalidate-tag-songs"]
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch topic details:", error);
    return null;
  }
}

export default async function TopicDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Lấy dữ liệu topic theo id từ params
  const topicDetail = await getTopicDetail(params.id);

  if (!topicDetail) {
    return (
      <Typography
        color="primary"
        sx={{ textAlign: "center", marginTop: "20px" }}
      >
        Không thể tải thông tin topic.
      </Typography>
    );
  }

  // Lấy danh sách bài hát của topic (có thể thay đổi endpoint nếu cần)
  const datall: any = await apiBasicServer(
    "GET",
    `/songs/song-of-topic/${topicDetail._id}`,
    undefined,
    undefined,
    undefined,
    ["revalidate-tag-songs", "revalidate-tag-topics"]
  );

  const datas = datall?.data || [];
  let favoriteSongs: string[] = [];
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
      {/* Hiển thị thông tin chi tiết về topic */}
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
          src={topicDetail.avatar}
          alt={topicDetail.title}
          sx={{ width: 120, height: 120, marginBottom: "10px" }}
        />
        <Typography variant="h4" sx={{ marginBottom: "10px" }}>
          {topicDetail.title}
        </Typography>

        <Typography
          sx={{
            marginBottom: "10px",
            fontSize: "18px",
            color: "text.secondary",
          }}
        >
          {topicDetail.description}
        </Typography>
      </Paper>

      {/* Hiển thị danh sách bài hát liên quan đến topic */}
      <Grid container spacing={2}>
        {datas.length > 0 ? (
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
