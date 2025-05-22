import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import PlayPauseButton from "./components/PlayPauseButton";
import StatusChip from "./components/StatusChip";
import SongForYouButton from "./components/SongForYouButton";

import { apiBasicServer } from "@/app/utils/request";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";

import ButtonRedirect from "@/component/buttonRedirect";
import PaginationComponent from "@/component/PaginationComponent";

import { getTranslations } from "next-intl/server";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.manageSongs",
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
interface Topic {
  id: string;
  title: string;
}

interface Singer {
  fullName: string;
}

interface Song {
  id: string;
  title: string;
  avatar: string;
  singer: Singer;
  topic: Topic;
  status: string;
}

interface SongsProps {
  searchParams: { page?: string }; // Lấy query `page` từ URL
}

const ManagerSongPage = async ({ searchParams }: SongsProps) => {
  const t = await getTranslations("managerSongPage");
  const limitItem = 12;
  const currentPage = parseInt(searchParams?.page || "1", 10);

  const fetchSongs = async (): Promise<{
    songs: Song[];
    listSongForYou: string[];
    totalPages: number;
  }> => {
    const access_token = GetAccessTokenFromCookie();
    try {
      // Fetch danh sách bài hát
      let songResponse = await apiBasicServer(
        "GET",
        "/songs/full",
        { limit: limitItem, skip: (currentPage - 1) * limitItem },
        undefined,
        access_token,
        ["revalidate-tag-songs"]
      );
      songResponse = songResponse?.data || undefined;
      // Fetch danh sách "Đề cử"
      const forYouResponse = await apiBasicServer(
        "GET",
        "/song-for-you",
        undefined,
        undefined,
        access_token,
        ["revalidate-tag-song-for-you"]
      );

      return {
        songs: songResponse?.data || [],
        listSongForYou:
          forYouResponse?.data?.listSong.map((s: { id: string }) => s.id) || [],
        totalPages: Math.ceil(songResponse?.total / limitItem),
      };
    } catch (error) {
      console.error("Error fetching songs:", error);
      return { songs: [], listSongForYou: [], totalPages: 1 };
    }
  };

  const { songs, listSongForYou, totalPages } = await fetchSongs();

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"15px"}
      >
        <Typography variant="h4" gutterBottom>
          {t("title")}
        </Typography>
        <ButtonRedirect
          link="/admin/managerSong/songs-for-you"
          content={t("redirectButton")}
          variant="outlined"
          color="primary"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("tableHeaders.index")}</TableCell>
              <TableCell>{t("tableHeaders.image")}</TableCell>
              <TableCell>{t("tableHeaders.title")}</TableCell>
              <TableCell>{t("tableHeaders.topic")}</TableCell>
              <TableCell>{t("tableHeaders.singer")}</TableCell>
              <TableCell>{t("tableHeaders.play")}</TableCell>
              <TableCell>{t("tableHeaders.status")}</TableCell>
              <TableCell>{t("tableHeaders.featured")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {songs.map((song, index) => (
              <TableRow key={song.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={song.avatar}
                    alt={song.title}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.topic?.title || t("unknown")}</TableCell>
                <TableCell>{song.singer?.fullName || t("unknown")}</TableCell>
                <TableCell>
                  <PlayPauseButton song={song} />
                </TableCell>
                <TableCell>
                  <StatusChip songId={song.id} status={song.status} />
                </TableCell>
                <TableCell>
                  <SongForYouButton
                    songId={song.id}
                    initialForYou={listSongForYou.includes(song.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationComponent totalPages={totalPages} />
    </Box>
  );
};

export default ManagerSongPage;
