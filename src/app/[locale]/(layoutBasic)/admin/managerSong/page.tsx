import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import PlayPauseButton from "./components/PlayPauseButton"; // CSR Component
import StatusChip from "./components/StatusChip"; // CSR Component
import SongForYouButton from "./components/SongForYouButton"; // CSR Component
import { apiBasicServer } from "@/app/utils/request";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import ButtonRedirect from "@/component/buttonRedirect";
import PaginationComponent from "@/component/PaginationComponent";

interface Topic {
  _id: string;
  title: string;
}

interface Singer {
  fullName: string;
}

interface Song {
  _id: string;
  title: string;
  avatar: string;
  singerId: Singer;
  topicId: Topic;
  status: string;
}
interface SongsProps {
  searchParams: { page?: string }; // Lấy query `page` từ URL
}

const ManagerSongPage = async ({ searchParams }: SongsProps) => {
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
          forYouResponse?.data?.listSong.map((s: { _id: string }) => s._id) ||
          [],
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
          Quản lý bài hát
        </Typography>
        <ButtonRedirect
          link="/admin/managerSong/songs-for-you"
          content="Quản lý bài hát đề cử"
          variant="outlined"
          color="primary"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Ca sĩ</TableCell>
              <TableCell>Phát</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đề cử</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {songs.map((song, index) => (
              <TableRow key={song._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={song.avatar}
                    alt={song.title}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.topicId?.title || "Không rõ"}</TableCell>
                <TableCell>{song.singerId?.fullName || "Không rõ"}</TableCell>
                <TableCell>
                  <PlayPauseButton song={song} />
                </TableCell>
                <TableCell>
                  <StatusChip songId={song._id} status={song.status} />
                </TableCell>
                <TableCell>
                  <SongForYouButton
                    songId={song._id}
                    initialForYou={listSongForYou.includes(song._id)}
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
