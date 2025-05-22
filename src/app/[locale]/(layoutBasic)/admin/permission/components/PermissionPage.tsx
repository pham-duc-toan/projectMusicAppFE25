"use client";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";

import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

// Định nghĩa kiểu cho role
interface Role {
  roleName: string;
  permissions: string[]; // Mảng các permission IDs
  roleId: string;
}

// Định nghĩa kiểu cho permission
interface Permission {
  name: string;
  id: string;
  pathName: string;
  method: string;
}

export default function PermissionPage() {
  const [saving, setSaving] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]); // Danh sách vai trò
  const t = useTranslations("PermissionPage");
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]); // Danh sách quyền
  const [open, setOpen] = useState<boolean>(false); // Điều khiển trạng thái mở/đóng của modal
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [openEditModal, setOpenEditModal] = useState(false); // Modal chỉnh sửa
  const [openViewModal, setOpenViewModal] = useState(false); // Modal xem chi tiết
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Modal xóa
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(
    null
  );
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const { showMessage } = useAppContext();
  const router = useRouter();
  const access_token = getAccessTokenFromLocalStorage();
  if (!access_token) {
    router.push(`/`);
  }
  const fetchRolesAndPermissions = async () => {
    setLoading(true); // Bắt đầu tải
    try {
      // Gọi API lấy danh sách vai trò
      const rolesRes = await apiBasicClient("GET", "/roles");
      if (rolesRes.statusCode >= 300) {
        showMessage(rolesRes.message, "error");
        router.push(`/`);
      }

      const rolesData = rolesRes.data.map((role: any) => ({
        roleName: role.roleName,
        permissions: role.permissions, // Giả định mỗi vai trò có một mảng các permission IDs
        roleId: role.id, // Lưu lại id của vai trò để xử lý sau này nếu cần
      }));

      // Gọi API lấy danh sách quyền
      const permissionsRes = await apiBasicClient("GET", "/permissions");
      if (permissionsRes.statusCode >= 300) {
        showMessage(permissionsRes.message, "error");
        router.push(`/`);
      }
      const permissionsData = permissionsRes.data.map((permission: any) => ({
        name: permission.name,
        id: permission.id, // Lưu lại id của quyền để đối chiếu
        pathName: permission.pathName,
        method: permission.method,
      }));

      setRoles(rolesData);
      setPermissionsList(permissionsData);
    } catch (error) {
      showMessage(t("errors.serverConnection"), "error");
      console.error(t("errors.fetchError"), error);
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddPermission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const newPermission = {
      name: formData.get("name") as string,
      pathName: formData.get("pathName") as string,
      method: formData.get("method") as string,
    };
    try {
      const res = await apiBasicClient(
        "POST",
        "/permissions",
        undefined,
        newPermission
      );
      if (res.statusCode >= 300) {
        showMessage(res.message, "error");
      }
    } catch (error: any) {
      showMessage(t("errors.addPermission"), "error");
    }
    setSaving(false);
    handleClose();
    await fetchRolesAndPermissions();
  };
  const handleEditPermission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPermission = {
      name: formData.get("name") as string,
      pathName: formData.get("pathName") as string,
      method: formData.get("method") as string,
    };
    const res = await apiBasicClient(
      "PATCH",
      `/permissions/${currentPermission?.id}`,
      undefined,
      newPermission
    );
    if (res.statusCode >= 300) {
      showMessage(res.message, "error");
    }
    await fetchRolesAndPermissions();

    setOpenEditModal(false);
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const updatedRoles: { roleId: string; permissions: string[] }[] = [];

    const formData = new FormData(e.currentTarget);

    // Duyệt qua từng role
    roles.forEach((role) => {
      const rolePermissions: string[] = [];
      permissionsList.forEach((permission) => {
        const checkboxValue = formData.get(`${role.roleId}-${permission.id}`);
        if (checkboxValue) {
          // Nếu checkbox được tích, thêm permission ID vào mảng
          rolePermissions.push(permission.id);
        }
      });

      // Thêm role vào updatedRoles với các permissions hiện tại
      updatedRoles.push({
        roleId: role.roleId,
        permissions: rolePermissions,
      });
    });

    try {
      await Promise.all(
        updatedRoles.map((role) =>
          apiBasicClient("PATCH", `/roles/${role.roleId}`, undefined, {
            permissions: role.permissions,
          })
        )
      );
      showMessage(t("messages.updateSuccess"), "success");
    } catch (error) {
      console.error(t("errors.updateFailed"), error);
    }
    setSaving(false);
    await fetchRolesAndPermissions();
  };

  const handleDelete = (permission: Permission) => {
    setCurrentPermission(permission); // Lưu quyền cần xóa
    setOpenDeleteModal(true);
  };

  const handleView = (permission: Permission) => {
    // Handle view logic here
    setCurrentPermission(permission); // Lưu quyền cần xem
    setOpenViewModal(true);
  };

  const handleEdit = (permission: Permission) => {
    setCurrentPermission(permission); // Lưu quyền đang chỉnh sửa
    setOpenEditModal(true);
  };

  // Hàm xử lý tạo mới role
  const handleAddRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRole = {
      roleName: formData.get("roleName") as string,
    };

    try {
      const res = await apiBasicClient("POST", "/roles", undefined, newRole);
      if (res.statusCode >= 300) {
        showMessage(res.message, "error");
      } else {
        showMessage(t("messages.roleCreateSuccess"), "success");
        await revalidateByTag("revalidate-tag-roles");
        setOpenRoleModal(false);

        await fetchRolesAndPermissions();
      }
    } catch (error: any) {
      showMessage(error?.message || t("errors.createRoleFailed"), "error");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const res = await apiBasicClient("DELETE", `/roles/${roleId}`);
      if (res.statusCode >= 300) {
        showMessage(res.message, "error");
      } else {
        showMessage(t("messages.roleDeleteSuccess"), "success");
        await revalidateByTag("revalidate-tag-roles");
        await fetchRolesAndPermissions(); // Cập nhật lại danh sách vai trò
      }
    } catch (error: any) {
      showMessage(error?.message || t("errors.deleteRoleFailed"), "error");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignContent={"center"}
      >
        <Typography variant="h4" gutterBottom>
          {t("title")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleOpen}
        >
          {t("addPermission")}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setOpenRoleModal(true)}
        >
          {t("addRole")}
        </Button>
      </Box>
      <Dialog open={openRoleModal} onClose={() => setOpenRoleModal(false)}>
        <form onSubmit={handleAddRole}>
          <DialogTitle>{t("addRoleTitle")}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="roleName"
              label={t("roleName")}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRoleModal(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" color="primary">
              {t("create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <form onSubmit={handleSaveChanges}>
        <TableContainer>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
                flexDirection: "column",
              }}
            >
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton
                    key={idx}
                    variant="rectangular"
                    width="100%"
                    height={60}
                    sx={{ marginBottom: 2 }}
                  />
                ))}
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("feature")}</TableCell>
                  {roles.length > 0 ? (
                    roles.map((role, index) => (
                      <TableCell key={index}>
                        <Box>
                          {role.roleName}
                          <IconButton
                            onClick={() => handleDeleteRole(role.roleId)}
                            color="primary"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    ))
                  ) : (
                    <TableCell>{t("noRoles")}</TableCell>
                  )}
                  <TableCell>{t("action")}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {permissionsList.length > 0 ? (
                  permissionsList.map((permission, permIndex) => (
                    <TableRow key={permIndex}>
                      <TableCell>{permission.name}</TableCell>
                      {roles.map((role, roleIndex) => (
                        <TableCell key={roleIndex}>
                          <Checkbox
                            name={`${role.roleId}-${permission.id}`}
                            defaultChecked={role.permissions.some(
                              //@ts-ignore
                              (p) => p.id === permission.id
                            )}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <IconButton
                          onClick={() => handleView(permission)}
                          color="primary"
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEdit(permission)}
                          color="secondary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(permission)}
                          color="primary"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={roles.length + 2}>
                      {t("noPermissions")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={saving ? true : false}
          sx={{ mt: 2 }}
        >
          {t("saveChanges")}
        </Button>
      </form>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleAddPermission}>
          <DialogTitle>{t("dialogs.addPermission")}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label={t("fields.name")}
              fullWidth
            />
            <TextField
              margin="dense"
              name="pathName"
              label={t("fields.pathName")}
              fullWidth
            />
            <TextField
              margin="dense"
              name="method"
              label={t("fields.method")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("buttons.cancel")}</Button>
            <Button disabled={saving} type="submit" color="primary">
              {t("buttons.add")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {permissionsList.length > 0 && (
        <>
          <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
            <form onSubmit={handleEditPermission}>
              <DialogTitle>{t("dialogs.editPermission")}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label={t("fields.name")}
                  defaultValue={currentPermission?.name}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  name="pathName"
                  label={t("fields.pathName")}
                  defaultValue={currentPermission?.pathName.substring(8)}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  name="method"
                  label={t("fields.method")}
                  defaultValue={currentPermission?.method}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEditModal(false)}>
                  {t("buttons.cancel")}
                </Button>
                <Button disabled={loading} type="submit" color="primary">
                  {t("buttons.saveChanges")}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Dialog open={openViewModal} onClose={() => setOpenViewModal(false)}>
            <DialogTitle>{t("dialogs.viewPermission")}</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                name="name"
                label={t("fields.name")}
                value={currentPermission?.name}
                fullWidth
                disabled
              />
              <TextField
                margin="dense"
                name="pathName"
                label={t("fields.pathName")}
                value={currentPermission?.pathName}
                fullWidth
                disabled
              />
              <TextField
                margin="dense"
                name="method"
                label={t("fields.method")}
                value={currentPermission?.method}
                fullWidth
                disabled
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewModal(false)}>
                {t("buttons.cancel")}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
          >
            <DialogTitle>
              {t("dialogs.deleteConfirmation", {
                name: currentPermission?.name,
              })}
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenDeleteModal(false)}>
                {t("buttons.cancel")}
              </Button>
              <Button
                disabled={loading}
                color="primary"
                onClick={async () => {
                  if (currentPermission) {
                    await apiBasicClient(
                      "DELETE",
                      `/permissions/${currentPermission.id}`
                    );
                    await fetchRolesAndPermissions();
                    setOpenDeleteModal(false);
                  }
                }}
              >
                {t("buttons.delete")}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
