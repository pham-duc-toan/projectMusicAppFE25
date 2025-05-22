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
import Chip from "@mui/material/Chip";

import { apiBasicServer } from "@/app/utils/request";
import ButtonRedirect from "@/component/buttonRedirect";
import ButtonActionModal from "./component/ButtonActionModal";
import { getTranslations } from "next-intl/server";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";

interface Topic {
  id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.manageTopics",
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
              <TableRow key={topic.id}>
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
