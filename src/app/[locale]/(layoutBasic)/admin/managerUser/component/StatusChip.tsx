"use client";

import React, { useState } from "react";

import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { revalidateByTag } from "@/app/action";
import { useTranslations } from "next-intl";

interface StatusChipProps {
  id: string;
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ id, status }) => {
  const t = useTranslations("statusChip");
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppContext();

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const response = await apiBasicClient(
        "PATCH",
        `/users/change-status/${id}`
      );
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error");
      } else {
        setCurrentStatus(response.data.status); // Cập nhật trạng thái mới
        await revalidateByTag("revalidate-tag-users"); // Revalidate dữ liệu
        showMessage(t("messages.success"), "success");
      }
    } catch (error) {
      console.error("Failed to change status:", error);
      showMessage(t("messages.error"), "error");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <CircularProgress size={20} />
  ) : (
    <Chip
      label={
        currentStatus === "active" ? t("label.active") : t("label.inactive")
      }
      color={currentStatus === "active" ? "success" : "error"}
      onClick={handleStatusChange}
      clickable
    />
  );
};

export default StatusChip;
