import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "@/i18n/routing";
import { apiBasicServer, getInfoUser } from "@/app/utils/request";
import { TSongDetail } from "@/dataType/song";
import ActionButton from "./components/ActionButton";
import { GetPublicAccessTokenFromCookie } from "@/app/utils/checkRole";

const ManagetopSong: React.FC = async () => {
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
      dataFs.data.listFavoriteSong.map((song: any) => song._id) || [];
  }
  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginBottom={"15px"}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          BẢNG XẾP HẠNG BÀI HÁT
        </Typography>
        <Button variant="outlined" color="primary">
          <Link href={"/songs"}>Tất cả các bài hát</Link>
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Thứ hạng</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Lượt nghe</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Ca sĩ</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {topSong && topSong.length > 0 ? (
              topSong.map((song: TSongDetail, index: number) => (
                <TableRow key={song._id}>
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
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.listen}</TableCell>
                  <TableCell>
                    {song.topicId?.title || "Không rõ thể loại"}
                  </TableCell>
                  <TableCell>
                    {song.singerId?.fullName || "Không rõ ca sĩ"}
                  </TableCell>
                  <TableCell>
                    <ActionButton fSongs={favoriteSongs} data={song} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ textAlign: "center", color: "gray" }}
                >
                  Hiện không có bài hát nào
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
