"use client";
import "@fontsource/inter"; // Mặc định weight 400
import "@fontsource/inter/600.css"; // Nếu cần các weight khác

import { revalidateByTag } from "@/app/action";
import { decodeToken } from "@/app/helper/jwt";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "next-intl";

const RegisterNow = () => {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useAppContext();
  const router = useRouter();
  const locale = useLocale();
  const handleRegisterNow = async () => {
    setLoading(true);
    const accessToken = getAccessTokenFromLocalStorage();
    const info = decodeToken(accessToken || undefined);
    if (info?.singerId) {
      router.push(`/${locale}/`);
      return;
    }

    try {
      const res = await apiBasicClient("GET", "/orders/checkUser/payment");
      if (res.data) {
        router.push(`/${locale}/singers/createSinger`);
        return;
      }
    } catch (error) {
      showMessage("Không thể thực hiện!", "error");
    }
    try {
      const res = await apiBasicClient("POST", "/payment");
      if (res?.statusCode == 201) {
        try {
          //tao order
          const response = await apiBasicClient(
            "POST",
            "/orders/create",
            undefined,
            {
              orderId: res.data.orderId,
              //vi shortLink dang bi loi
              shortLink: res.data.payUrl,
            }
          );
          if (response?.data?.orderId) {
            await apiBasicClient(
              "POST",
              "/payment/transaction-status",
              undefined,
              { orderId: response.data.orderId }
            );
          }
          await revalidateByTag("revalidate-tag-orders");
        } catch (error) {
          showMessage("Lỗi kết nối với server", "error");
          return;
        }
        //vi shortLink dang bi loi
        router.push(res.data.payUrl);
      } else {
        showMessage("Không thể thực hiện !", "error");
      }
    } catch (error) {
      showMessage("Không thể thực hiện !", "error");
    }
    setLoading(false);
  };

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={handleRegisterNow}
      disabled={loading}
      sx={{
        backgroundColor: "#9457ff",
        ":hover": { backgroundColor: "#9457ff" },
        padding: "20px",
        borderRadius: "50px",
      }}
    >
      Thanh toán ngay
    </Button>
  );
};

export default RegisterNow;
