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
  const t = useTranslations("statusChip"); // Ngữ cảnh statusChip
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
        showMessage(response.message, "error"); // Lấy message từ API (giữ nguyên)
      } else {
        await revalidateByTag("revalidate-tag-singers");
        setCurrentStatus(response.data.status); // Update trạng thái mới
        showMessage(t("messages.success"), "success"); // Chuỗi tĩnh song ngữ
      }
    } catch (error) {
      console.error("Failed to change status:", error);
      showMessage(t("messages.error"), "error"); // Chuỗi tĩnh song ngữ
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
