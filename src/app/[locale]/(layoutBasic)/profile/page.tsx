import { Box, Typography, Avatar, Paper, Button, Stack } from "@mui/material";
import { getInfoUser } from "@/app/utils/request";
import { Link } from "@/i18n/routing";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import IUserInfo from "@/dataType/infoUser";
import ButtonRedirect from "@/component/buttonRedirect";

async function fetchProfileData(): Promise<IUserInfo | null> {
  const access_token = GetAccessTokenFromCookie();

  try {
    const data = await getInfoUser(access_token.value);

    return data?.data || null;
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const profileData = await fetchProfileData();

  if (!profileData) return <p>Error loading profile data.</p>;

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

          marginBottom: "30px",
          padding: "20px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Avatar
          src={`${profileData.avatar}`}
          alt={profileData.fullName}
          sx={{ width: 100, height: 100, marginBottom: "10px" }}
        />

        <Typography variant="h5">{profileData.fullName}</Typography>
        <Typography color="textSecondary" sx={{ marginBottom: "10px" }}>
          {profileData.username}
        </Typography>
        <Typography variant="body1">
          <strong>Vai trò:</strong> {profileData.role.roleName}
        </Typography>
        <Typography variant="body2" color="textSecondary" marginBottom={"20px"}>
          <strong>Loại người dùng:</strong> {profileData.type}
        </Typography>
        <ButtonRedirect
          link="/profile/editProfile"
          content="Chỉnh sửa"
          variant="outlined"
        />
      </Paper>

      {profileData.singerId && (
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            marginBottom: "30px",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Thông tin ca sĩ quản lý
          </Typography>
          <Avatar
            src={
              profileData.singerId?.avatar
                ? profileData.singerId.avatar
                : "https://res.cloudinary.com/dsi9ercdo/image/upload/v1731207669/oagc6qxabksf7lzv2wy9.jpg"
            }
            alt={profileData.singerId?.fullName || "Không rõ ca sĩ"}
            sx={{ width: 80, height: 80, marginBottom: "10px" }}
          />
          <Typography variant="h5">
            {profileData.singerId?.fullName || "Không rõ ca sĩ"}
          </Typography>
          <Typography color="textSecondary" sx={{ marginBottom: "10px" }}>
            <strong>Trạng thái:</strong>{" "}
            {profileData.singerId?.status || "Tài khoản đã bị xóa"}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <ButtonRedirect
              link={
                profileData.singerId?._id
                  ? `/singers/detailSinger/${profileData.singerId.slug}`
                  : "#"
              }
              variant="outlined"
              content=" Xem chi tiết"
            />

            <ButtonRedirect
              content="Chỉnh sửa"
              link="/profile/editSinger"
              variant="outlined"
              color="primary"
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
