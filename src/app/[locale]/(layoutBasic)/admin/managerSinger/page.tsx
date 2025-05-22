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

import { apiBasicServer } from "@/app/utils/request";
import StatusChip from "./component/StatusChip";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import DeleteSingerDialog from "./component/DeleteSingerDialog";
import { getTranslations } from "next-intl/server";

interface Singer {
  id: string;
  fullName: string;
  avatar: string;
  status: string;
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.manageSingers",
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
              <TableRow key={singer.id}>
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
                  <StatusChip id={singer.id} status={singer.status} />
                </TableCell>
                <TableCell>
                  <DeleteSingerDialog singer={singer.id} />
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
