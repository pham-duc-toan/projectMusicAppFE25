"use client";
import { revalidateByTag } from "@/app/action";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";

import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const ChangeStatus = ({ song }: any) => {
  const [status, setStatus] = useState(song.status);
  const { showMessage } = useAppContext();
  const t = useTranslations("changeStatus");

  useEffect(() => {
    setStatus(song.status);
  }, [song]);

  const handleClick = async () => {
    const newStatus = status === "active" ? "inactive" : "active";
    try {
      showMessage(t("processing"), "info");
      const response = await apiBasicClient(
        "PATCH",
        `/songs/editSong/${song.id}`,
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
      showMessage(t("success"), "success");
    } catch (error) {
      console.error("Failed to change status:", error);
    }
  };

  return (
    <Tooltip onClick={handleClick} title={t("tooltip")} arrow>
      <Chip
        label={status === "active" ? t("active") : t("inactive")}
        color={status === "active" ? "success" : "error"}
      />
    </Tooltip>
  );
};

export default ChangeStatus;
