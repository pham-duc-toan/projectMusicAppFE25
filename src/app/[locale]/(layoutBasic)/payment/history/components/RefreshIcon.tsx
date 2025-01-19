"use client";
import { revalidateByTag } from "@/app/action";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";

import RefreshIcon2 from "@mui/icons-material/Refresh";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useTranslations } from "next-intl";

interface RefreshTokenProps {
  orderId: string;
}

const RefreshIcon = ({ orderId }: RefreshTokenProps) => {
  const { showMessage } = useAppContext();
  const t = useTranslations("RefreshIcon");

  const handleRefresh = async (orderId: string) => {
    try {
      await apiBasicClient("POST", "/payment/transaction-status", undefined, {
        orderId: orderId,
      });
      await revalidateByTag("revalidate-tag-orders");
      showMessage(t("messages.success"), "success");
    } catch (error) {
      showMessage(t("messages.error"), "error");
    }
  };

  return (
    <Tooltip title={t("tooltip")} arrow>
      <IconButton onClick={() => handleRefresh(orderId)}>
        <RefreshIcon2 />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshIcon;
