"use client";
import { revalidateByTag } from "@/app/action";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import RefreshIcon2 from "@mui/icons-material/Refresh";
import { IconButton, Tooltip } from "@mui/material";

interface RefreshTokenProps {
  orderId: string;
}

const RefreshIcon = ({ orderId }: RefreshTokenProps) => {
  const { showMessage } = useAppContext();
  const handleRefresh = async (orderId: string) => {
    try {
      await apiBasicClient("POST", "/payment/transaction-status", undefined, {
        orderId: orderId,
      });
      await revalidateByTag("revalidate-tag-orders");
      showMessage("Refreshed", "success");
    } catch (error) {
      showMessage("Lỗi server", "error");
    }
  };

  return (
    <Tooltip title="Làm mới" arrow>
      <IconButton onClick={() => handleRefresh(orderId)}>
        <RefreshIcon2 />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshIcon;
