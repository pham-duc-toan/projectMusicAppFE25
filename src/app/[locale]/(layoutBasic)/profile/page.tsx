import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { getInfoUser } from "@/app/utils/request";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import IUserInfo from "@/dataType/infoUser";
import ButtonRedirect from "@/component/buttonRedirect";
import { getTranslations } from "next-intl/server";

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
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.profile",
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
export default async function ProfilePage() {
  const t = await getTranslations("ProfilePage");
  const profileData = await fetchProfileData();

  if (!profileData) return <p>{t("errors.loadProfile")}</p>;

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
          <strong>{t("fields.role")}:</strong> {profileData.role.roleName}
        </Typography>
        <Typography variant="body2" color="textSecondary" marginBottom={"20px"}>
          <strong>{t("fields.userType")}:</strong> {profileData.type}
        </Typography>
        <ButtonRedirect
          link="/profile/editProfile"
          content={t("buttons.edit")}
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
            {t("singerInfo.title")}
          </Typography>
          <Avatar
            src={
              profileData.singerId?.avatar
                ? profileData.singerId.avatar
                : "https://res.cloudinary.com/dsi9ercdo/image/upload/v1731207669/oagc6qxabksf7lzv2wy9.jpg"
            }
            alt={profileData.singerId?.fullName || t("singerInfo.unknown")}
            sx={{ width: 80, height: 80, marginBottom: "10px" }}
          />
          <Typography variant="h5">
            {profileData.singerId?.fullName || t("singerInfo.unknown")}
          </Typography>
          <Typography color="textSecondary" sx={{ marginBottom: "10px" }}>
            <strong>{t("singerInfo.status")}:</strong>{" "}
            {profileData.singerId?.status || t("singerInfo.deleted")}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <ButtonRedirect
              link={
                profileData.singerId?.id
                  ? `/singers/detailSinger/${profileData.singerId.slug}`
                  : "#"
              }
              variant="outlined"
              content={t("buttons.viewDetails")}
            />

            <ButtonRedirect
              content={t("buttons.edit")}
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
