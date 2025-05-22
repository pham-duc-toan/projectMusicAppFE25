"use client";
import React, { useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import EditIcon from "@mui/icons-material/Edit";

import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { useRouter } from "next/navigation";
import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  username: string;
  avatar: string;
  status: string;
  role: {
    roleName: string;
    id: string;
  };
}
interface EditRoleUserModalProps {
  user: User;
}

const EditRoleUserModal: React.FC<EditRoleUserModalProps> = ({ user }) => {
  const t = useTranslations("editRoleUserModal");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const { showMessage } = useAppContext();
  const route = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedRoleId(user?.role?.id || "");
  };

  const fetchApi = async () => {
    const res = await apiBasicClient("GET", "/roles");
    if (res?.data) {
      setRoles(res.data);
      const defaultRole = res.data.find(
        (role: any) => role.id === user?.role?.id
      );
      if (defaultRole) {
        setSelectedRoleId(defaultRole.id);
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
        `/users/change-role/${user.id}/${selectedRoleId}`
      );

      if (res?.data) {
        await revalidateByTag("revalidate-tag-users");
        showMessage(t("messages.success"), "success");
        handleClose();
      } else {
        showMessage(t("messages.failure"), "error");
      }
    } catch (error) {
      showMessage(t("messages.error"), "error");
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
        <DialogTitle>{t("dialogTitle")}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} marginTop={"10px"}>
                <FormControl fullWidth>
                  <InputLabel>{t("form.selectRole")}</InputLabel>
                  <Select
                    name="role"
                    label={t("form.selectRole")}
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
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
            justifyContent: "space-between",
          }}
        >
          <Button color="primary" onClick={handleClose}>
            {t("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={24} /> : null}
            onClick={handleSubmit}
          >
            {loading ? t("buttons.submitting") : t("buttons.submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditRoleUserModal;
