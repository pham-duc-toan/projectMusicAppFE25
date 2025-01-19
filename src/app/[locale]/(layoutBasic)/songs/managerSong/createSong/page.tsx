import { decodeToken } from "@/app/helper/jwt";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import ButtonRedirect from "@/component/buttonRedirect";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SongCreateComponent from "./components/SongCreateComponent";
import { getTranslations } from "next-intl/server";

interface UserInfo {
  singerId?: string;
}

const CreatePage = async () => {
  const t = await getTranslations("songCreatePage");
  const access_token: any = GetAccessTokenFromCookie();
  const userInfo = decodeToken(access_token.value) as UserInfo | undefined;

  return (
    <>
      {userInfo?.singerId ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            marginBottom={"15px"}
          >
            <Typography
              variant="h4"
              sx={{ marginBottom: "30px", marginTop: "40px" }}
            >
              {t("createSongTitle")}
            </Typography>
            <ButtonRedirect
              content={t("manageSongs")}
              link="/songs/managerSong"
              variant="outlined"
            />
          </Box>
          <SongCreateComponent />
        </>
      ) : (
        <Box
          marginTop={"200px"}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <Typography variant="h6" color="error">
            {t("notASinger")}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default CreatePage;
