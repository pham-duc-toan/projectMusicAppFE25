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

import { apiBasicServer } from "@/app/utils/request";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import ButtonRedirect from "@/component/buttonRedirect";
import PlayPauseButton from "../../admin/managerSong/components/PlayPauseButton";
import ChangeStatus from "./component/ChangStatus";
import ButtonActionModal from "./component/ButtonActionModal";

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
  slug: string;
}

const fetchSongs = async (): Promise<{
  songs: Song[];
}> => {
  const access_token = GetAccessTokenFromCookie();
  try {
    // Fetch danh sách bài hát
    const songResponse = await apiBasicServer(
      "GET",
      "/songs/managerSong",
      undefined,
      undefined,
      access_token,
      ["revalidate-tag-songs"]
    );

    return {
      songs: songResponse?.data || [],
    };
  } catch (error) {
    console.error("Error fetching songs:", error);
    return { songs: [] };
  }
};

const ManagerSongPage = async () => {
  const { songs } = await fetchSongs();

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginBottom={"15px"}
        alignItems={"center"}
      >
        <Typography variant="h4" gutterBottom>
          Quản lý bài hát
        </Typography>
        <ButtonRedirect
          link="/songs/managerSong/createSong"
          content="Tạo mới bài hát"
          variant="contained"
          color="primary"
        />
      </Box>

      {songs.length === 0 ? (
        <Typography
          variant="h6"
          color="textSecondary"
          textAlign="center"
          fontStyle={"italic"}
        >
          Hiện chưa có bài hát nào.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Chủ đề</TableCell>
                <TableCell>Phát</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
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
                  <TableCell>
                    <PlayPauseButton song={song} />
                  </TableCell>
                  <TableCell>
                    <ChangeStatus song={song} />
                  </TableCell>
                  <TableCell>
                    <ButtonActionModal song={song} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManagerSongPage;
