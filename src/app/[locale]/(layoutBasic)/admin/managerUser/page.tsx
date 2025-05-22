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
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";

import StatusChip from "./component/StatusChip";
import DeleteUserButton from "./component/DeleteUserButton";
import EditRoleUserModal from "./component/EditRoleUserModal";

import PaginationComponent from "@/component/PaginationComponent";
import { getTranslations } from "next-intl/server";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.manageUsers",
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
interface User {
  id: string;
  username: string;
  userId: string;
  avatar: string;
  status: string;
  role: {
    roleName: string;
    id: string;
  };
}

const limitItem = 4;

const fetchUsers = async (page: number) => {
  const access_token = GetAccessTokenFromCookie();
  const skip = (page - 1) * limitItem;
  try {
    const response = await apiBasicServer(
      "GET",
      "/users",
      { populate: "role", skip, limit: limitItem },
      undefined,
      access_token,
      ["revalidate-tag-users", "revalidate-tag-roles"]
    );
    return {
      users: response?.data.data || [],
      total: response?.data.total || 0,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], total: 0 };
  }
};

const ManagerUserPage = async ({ searchParams }: { searchParams: any }) => {
  const t = await getTranslations("managerUserPage");
  const currentPage = parseInt(searchParams?.page || "1", 10);
  const { users, total } = await fetchUsers(currentPage);

  const totalPages = Math.ceil(total / limitItem);

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
              <TableCell>{t("tableHeaders.username")}</TableCell>
              <TableCell>{t("tableHeaders.role")}</TableCell>
              <TableCell>{t("tableHeaders.status")}</TableCell>
              <TableCell>{t("tableHeaders.actions")}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user: User, index: number) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={user.avatar}
                    alt={user.userId}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user?.role?.roleName || t("noRole")}</TableCell>
                <TableCell>
                  <StatusChip id={user.id} status={user.status} />
                </TableCell>
                <TableCell>
                  <EditRoleUserModal user={user} />
                  <DeleteUserButton id={user.id} username={user.userId} />
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

export default ManagerUserPage;
