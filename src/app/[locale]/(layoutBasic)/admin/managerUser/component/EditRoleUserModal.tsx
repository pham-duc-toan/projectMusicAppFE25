"use client";

import React, { useEffect, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { useRouter } from "next/navigation";
import { revalidateByTag } from "@/app/action";
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
interface EditRoleUserModalProps {
  user: User;
}

const EditRoleUserModal: React.FC<EditRoleUserModalProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const { showMessage } = useAppContext();
  const route = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedRoleId(user?.role?._id || "");
  };

  const fetchApi = async () => {
    const res = await apiBasicClient("GET", "/roles");
    if (res?.data) {
      setRoles(res.data);
      const defaultRole = res.data.find(
        (role: any) => role._id === user?.role?._id
      );
      if (defaultRole) {
        setSelectedRoleId(defaultRole._id);
      }
    } else {
      route.push("/");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiBasicClient(
        "PATCH",
        `/users/change-role/${user._id}/${selectedRoleId}`
      );

      if (res?.data) {
        await revalidateByTag("revalidate-tag-users");
        showMessage("Role updated successfully", "success");
        handleClose();
      } else {
        showMessage("Failed to update role", "error");
      }
    } catch (error) {
      showMessage("Error updating role", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} color="primary">
        <EditIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          sx: { width: "400px", maxWidth: "100%" },
        }}
      >
        <DialogTitle>Chỉnh sửa vai trò của người dùng</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} marginTop={"10px"}>
                <FormControl fullWidth>
                  <InputLabel>Chọn vai trò</InputLabel>
                  <Select
                    name="role"
                    label="Chọn vai trò"
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between", // Chia đều khoảng cách giữa các nút
          }}
        >
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={24} /> : null}
            onClick={handleSubmit} // Gọi hàm submit khi bấm nút
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditRoleUserModal;
