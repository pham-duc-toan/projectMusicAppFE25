"use client";
import React, { useState } from "react";

import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

import { apiBasicClient } from "@/app/utils/request";
import { revalidateByTag } from "@/app/action";
import { useAppContext } from "@/context-app";
import { useTranslations } from "next-intl";

interface StatusChipProps {
  songId: string;
  status: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ songId, status }) => {
  const t = useTranslations("statusChip");
  const { showMessage } = useAppContext();
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleClick = async () => {
    try {
      const response = await apiBasicClient(
        "PATCH",
        `/songs/changeStatus/${songId}`
      );
      if (response?.statusCode >= 300) {
        showMessage(response.message, "error"); // Dùng message từ API
      } else {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        setCurrentStatus(newStatus);
        revalidateByTag("revalidate-tag-songs");
        showMessage(t("messages.success"), "success"); // Sử dụng lại chuỗi thành công
      }
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  return (
    <Tooltip title={t("tooltip")} arrow>
      <Chip
        label={
          currentStatus === "active"
            ? t("label.active") // Sử dụng lại chuỗi "Hoạt động"
            : t("label.inactive") // Sử dụng lại chuỗi "Không hoạt động"
        }
        color={currentStatus === "active" ? "success" : "error"}
        onClick={handleClick}
      />
    </Tooltip>
  );
};

export default StatusChip;
