"use client";
import React, { useState, useEffect, useCallback } from "react";

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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

import StarIcon from "@mui/icons-material/Star";

import { apiBasicClient } from "@/app/utils/request";
import { Link } from "@/i18n/routing";
import { useAppContext } from "@/context-app";

import CellSingerInfo from "./components/CellSingerInfo";
import CellTopicInfo from "./components/CellTopicInfo";

import { useTranslations } from "next-intl";

interface Topic {
  id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}

interface Song {
  id: string;
  title: string;
  avatar: string;
  singer: {
    fullName: string;
    avatar: string;
    status: string;
    slug: string;
    deleted: boolean;
    updatedAt: string;
    createdAt: string;
  };
  topic: Topic;
  like: number;
  listen: number;
  audio: string;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}
const ManageFeaturedSongs: React.FC = () => {
  const t = useTranslations("manageFeaturedSongs");
  const { showMessage } = useAppContext();
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFeaturedSongs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient("GET", "/song-for-you");
      if (response?.data) {
        setFeaturedSongs(response.data.listSong || []);
      }
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      }
    } catch (error) {
      console.error("Error fetching featured songs", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveFromFeatured = async (songId: string) => {
    setLoading(true);
    try {
      const response = await apiBasicClient(
        "DELETE",
        `/song-for-you/remove/${songId}`
      );
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        setFeaturedSongs((prev) => prev.filter((song) => song.id !== songId));
      }
    } catch (error) {
      console.error("Error removing song from featured list", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData("text/plain"));
    const updatedList = [...featuredSongs];
    const [movedSong] = updatedList.splice(fromIndex, 1);
    updatedList.splice(index, 0, movedSong);
    setFeaturedSongs(updatedList);
  };

  const updateSongOrder = async () => {
    setLoading(true);
    try {
      const updatedIds = featuredSongs.map((song) => song.id);
      const response = await apiBasicClient(
        "PATCH",
        "/song-for-you/update-order",
        undefined,
        { listSong: updatedIds }
      );
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        showMessage(t("updateOrder"), "success");
      }
    } catch (error) {
      console.error("Error updating song order", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedSongs();
  }, [fetchFeaturedSongs]);

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
        <Button variant="contained" color="primary">
          <Link href={"/admin/managerSong"}>{t("manageSongs")}</Link>
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={updateSongOrder}
        sx={{ marginBottom: "20px" }}
      >
        {t("updateOrder")}
      </Button>

      <TableContainer component={Paper}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
              flexDirection: "column",
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton variant="rectangular" width="100%" height={60} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("tableHeaders.priority")}</TableCell>
                <TableCell>{t("tableHeaders.image")}</TableCell>
                <TableCell>{t("tableHeaders.title")}</TableCell>
                <TableCell>{t("tableHeaders.topic")}</TableCell>
                <TableCell>{t("tableHeaders.singer")}</TableCell>
                <TableCell>{t("tableHeaders.featured")}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {featuredSongs && featuredSongs.length > 0 ? (
                featuredSongs.map((song, index) => (
                  <TableRow
                    key={song.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, index)}
                    onDrop={(event) => handleDrop(event, index)}
                    onDragOver={(event) => event.preventDefault()}
                  >
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
                      <Typography>{index + 1}</Typography>
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
                    <CellSingerInfo singer={song.singer} />
                    <CellTopicInfo topicDetail={song.topic} />

                    <TableCell>
                      <Tooltip title={t("tooltips.removeFeatured")} arrow>
                        <IconButton
                          color="secondary"
                          onClick={() => handleRemoveFromFeatured(song.id)}
                        >
                          <StarIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", color: "gray" }}
                  >
                    {t("emptyState")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default ManageFeaturedSongs;
