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
import StatusChip from "./component/StatusChip";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import DeleteSingerDialog from "./component/DeleteSingerDialog";
import { getTranslations } from "next-intl/server";

interface Singer {
  _id: string;
  fullName: string;
  avatar: string;
  status: string;
}

const fetchSingers = async () => {
  const access_token = GetAccessTokenFromCookie();
  try {
    const response = await apiBasicServer(
      "GET",
      "/singers",
      undefined,
      undefined,
      access_token,
      ["revalidate-tag-singers"]
    );
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching singers:", error);
    return [];
  }
};

const ManagerSingerPage = async () => {
  const singers = await fetchSingers();
  const t = await getTranslations("managerSingerPage");

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginBottom={"15px"}
      >
        <Typography variant="h4" gutterBottom>
          {t("title")}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("tableHeaders.index")}</TableCell>
              <TableCell>{t("tableHeaders.avatar")}</TableCell>
              <TableCell>{t("tableHeaders.fullName")}</TableCell>
              <TableCell>{t("tableHeaders.status")}</TableCell>
              <TableCell>{t("tableHeaders.actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {singers.map((singer: Singer, index: number) => (
              <TableRow key={singer._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={singer.avatar}
                    alt={singer.fullName}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{singer.fullName}</TableCell>
                <TableCell>
                  <StatusChip id={singer._id} status={singer.status} />
                </TableCell>
                <TableCell>
                  <DeleteSingerDialog singerId={singer._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagerSingerPage;
