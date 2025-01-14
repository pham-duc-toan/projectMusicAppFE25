"use client";

import React, { useState } from "react";
import { Chip, CircularProgress } from "@mui/material";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { revalidateByTag } from "@/app/action";

interface StatusChipProps {
  id: string;
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ id, status }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppContext();

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient(
        "PATCH",
        `/singers/changeStatus/${id}`
      );
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        await revalidateByTag("revalidate-tag-singers");
        setCurrentStatus(response.data.status); // Cập nhật trạng thái mới
        showMessage("Cập nhật trạng thái thành công!", "success");
      }
    } catch (error) {
      console.error("Failed to change status:", error);
      showMessage("Đã xảy ra lỗi khi thay đổi trạng thái.", "error");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <CircularProgress size={20} />
  ) : (
    <Chip
      label={currentStatus === "active" ? "Hoạt động" : "Không hoạt động"}
      color={currentStatus === "active" ? "success" : "error"}
      onClick={handleStatusChange}
      clickable
    />
  );
};

export default StatusChip;
