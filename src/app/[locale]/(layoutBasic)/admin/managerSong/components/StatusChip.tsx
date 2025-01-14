"use client";

import React, { useState } from "react";
import { Chip, Tooltip } from "@mui/material";
import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";

interface StatusChipProps {
  songId: string;
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ songId, status }) => {
  const { showMessage } = useAppContext();
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleClick = async () => {
    try {
      const response = await apiBasicClient(
        "PATCH",
        `/songs/changeStatus/${songId}`
      );
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        setCurrentStatus(newStatus);
        revalidateByTag("revalidate-tag-songs");
        showMessage("Đổi trạng thái thành công!", "success");
      }
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  return (
    <Tooltip title="Đổi trạng thái" arrow>
      <Chip
        label={currentStatus === "active" ? "Hoạt động" : "Không hoạt động"}
        color={currentStatus === "active" ? "success" : "error"}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default StatusChip;
