import React, { useState, useEffect } from "react";
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
  Chip,
} from "@mui/material";

import { apiBasicClient, apiBasicServer } from "@/app/utils/request";
import ButtonRedirect from "@/component/buttonRedirect";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import ButtonActionModal from "./component/ButtonActionModal";

interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}
const fetchTopics = async () => {
  const access_token = GetAccessTokenFromCookie();
  try {
    const response = await apiBasicServer(
      "GET",
      "/topics",
      undefined,
      undefined,
      access_token,
      ["revalidate-tag-topics"]
    );
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};
const ManagerTopic = async () => {
  const topics = await fetchTopics();
  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"15px"}
      >
        <Typography variant="h4" gutterBottom>
          Quản lý chủ đề
        </Typography>
        <ButtonRedirect
          variant="outlined"
          link="/admin/managerTopic/createTopic"
          content="Thêm mới chủ đề"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên chủ đề</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic: Topic, index: number) => (
              <TableRow key={topic._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={topic.avatar}
                    alt={topic.title}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      topic.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"
                    }
                    color={topic.status === "active" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell>
                  <ButtonActionModal topic={topic} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagerTopic;
