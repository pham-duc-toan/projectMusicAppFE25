"use client";
import { revalidateByTag } from "@/app/action";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { TableCell, Tooltip, Chip } from "@mui/material";
import { useEffect, useState } from "react";

const ChangeStatus = ({ song }: any) => {
  const [status, setStatus] = useState(song.status);
  const { showMessage } = useAppContext();
  useEffect(() => {
    setStatus(song.status);
  }, [song]);
  const handleClick = async () => {
    const newStatus = status === "active" ? "inactive" : "active";
    try {
      showMessage("Đang thực hiện", "info");
      const response = await apiBasicClient(
        "PATCH",
        `/songs/editSong/${song._id}`,
        undefined,
        {
          status: newStatus,
        }
      );
      if (response.statusCode >= 300) {
        showMessage(response.message, "error");
      }
      revalidateByTag("revalidate-by-songs");
      setStatus(newStatus);
      showMessage("Thay đổi thành công", "success");
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  return (
    <Tooltip onClick={handleClick} title="Đổi trạng thái" arrow>
      <Chip
        label={status === "active" ? "Hoạt động" : "Không hoạt động"}
        color={status === "active" ? "success" : "error"}
      />
    </Tooltip>
  );
};

export default ChangeStatus;
