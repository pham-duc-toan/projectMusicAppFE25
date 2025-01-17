import React from "react";
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

import { apiBasicServer } from "@/app/utils/request";
import ButtonRedirect from "@/component/buttonRedirect";
import ButtonActionModal from "./component/ButtonActionModal";
import { getTranslations } from "next-intl/server";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";

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
  const t = await getTranslations("managerTopic");
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
          {t("title")}
        </Typography>
        <ButtonRedirect
          variant="outlined"
          link="/admin/managerTopic/createTopic"
          content={t("addButton")}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("tableHeaders.index")}</TableCell>
              <TableCell>{t("tableHeaders.image")}</TableCell>
              <TableCell>{t("tableHeaders.name")}</TableCell>
              <TableCell>{t("tableHeaders.status")}</TableCell>
              <TableCell>{t("tableHeaders.actions")}</TableCell>
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
                        ? t("status.active")
                        : t("status.inactive")
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
