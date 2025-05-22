import React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Link } from "@/i18n/routing";
import { apiBasicServer, getInfoUser } from "@/app/utils/request";
import { TSongDetail } from "@/dataType/song";

import ActionButton from "./components/ActionButton";
import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";
import CellTopicInfo from "../../admin/managerSong/songs-for-you/components/CellTopicInfo";
import CellSingerInfo from "../../admin/managerSong/songs-for-you/components/CellSingerInfo";

import { getTranslations } from "next-intl/server";

const ManagetopSong: React.FC = async () => {
  const t = await getTranslations("ManagetopSong");

  const resTop = await apiBasicServer(
    "GET",
    "/songs",
    {
      limit: 100,
      sort: "-listen",
    },
    undefined,
    undefined,
    ["revalidate-tag-songs"]
  );
  const topSong = resTop?.data?.data || [];

  let favoriteSongs = [];
  const access_token = GetPublicAccessTokenFromCookie();

  if (access_token) {
    const dataFs = await getInfoUser(access_token.value);
    favoriteSongs =
      dataFs.data.listFavoriteSong.map((song: any) => song.id) || [];
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginBottom={"15px"}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t("heading")}
        </Typography>
        <Button variant="outlined" color="primary">
          <Link href={"/songs"}>{t("allSongs")}</Link>
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("ranking")}</TableCell>
              <TableCell>{t("image")}</TableCell>
              <TableCell>{t("songTitle")}</TableCell>
              <TableCell>{t("views")}</TableCell>
              <TableCell>{t("topic")}</TableCell>
              <TableCell>{t("singer")}</TableCell>
              <TableCell>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {topSong && topSong.length > 0 ? (
              topSong.map((song: TSongDetail, index: number) => (
                <TableRow key={song.id}>
                  <TableCell
                    sx={{
                      color:
                        index === 0
                          ? "yellow"
                          : index === 1
                          ? "blue"
                          : index === 2
                          ? "brown"
                          : "inherit",
                    }}
                  >
                    <h1>{index + 1}</h1>
                  </TableCell>
                  <TableCell>
                    <Avatar
                      src={song.avatar}
                      alt={song.title}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/songs/detail/${song.slug}`}>
                      {song.title}
                    </Link>
                  </TableCell>
                  <TableCell>{song.listen}</TableCell>
                  <CellTopicInfo topicDetail={song.topic} />
                  <CellSingerInfo singer={song.singer} />
                  <TableCell>
                    <ActionButton fSongs={favoriteSongs} data={song} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ textAlign: "center", color: "gray" }}
                >
                  {t("noSongs")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagetopSong;
