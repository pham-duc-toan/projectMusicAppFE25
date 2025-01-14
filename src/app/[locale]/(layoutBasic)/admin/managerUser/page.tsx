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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiBasicServer } from "@/app/utils/request";

import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import StatusChip from "./component/StatusChip";
import DeleteUserButton from "./component/DeleteUserButton";
import EditRoleUserModal from "./component/EditRoleUserModal";
import PaginationComponent from "@/component/PaginationComponent";

interface User {
  _id: string;
  username: string;
  avatar: string;
  status: string;
  role: {
    roleName: string;
    _id: string;
  };
}

const limitItem = 4; // Số lượng người dùng hiển thị trên mỗi trang

const fetchUsers = async (page: number) => {
  const access_token = GetAccessTokenFromCookie();
  const skip = (page - 1) * limitItem; // Tính toán vị trí bắt đầu
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
  const currentPage = parseInt(searchParams?.page || "1", 10); // Lấy trang hiện tại từ URL
  const { users, total } = await fetchUsers(currentPage);

  const totalPages = Math.ceil(total / limitItem); // Tính tổng số trang

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginBottom={"15px"}
      >
        <Typography variant="h4" gutterBottom>
          Quản lý người dùng
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user: User, index: number) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    variant="rounded"
                  />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user?.role?.roleName || "Không có vai trò"}
                </TableCell>
                <TableCell>
                  <StatusChip id={user._id} status={user.status} />
                </TableCell>
                <TableCell>
                  <EditRoleUserModal user={user} />
                  <DeleteUserButton id={user._id} username={user.username} />
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
