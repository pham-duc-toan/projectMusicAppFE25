"use client";
import "@fontsource/inter";
import "@fontsource/inter/600.css";

import { revalidateByTag } from "@/app/action";
import { decodeToken } from "@/app/helper/jwt";
import { getAccessTokenFromLocalStorage } from "@/app/helper/localStorageClient";
import { apiBasicClient } from "@/app/utils/request";
import { useAppContext } from "@/context-app";

import Button from "@mui/material/Button";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const RegisterNow = () => {
  const t = useTranslations("registerNow"); // Dùng useTranslations() cho Client Component
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
      showMessage(t("errorMessage"), "error");
    }

    try {
      const res = await apiBasicClient("POST", "/payment");
      if (res?.statusCode == 201) {
        try {
          const response = await apiBasicClient(
            "POST",
            "/orders/create",
            undefined,
            {
              orderId: res.data.orderId,
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
          showMessage(t("serverError"), "error");
          return;
        }
        router.push(res.data.payUrl);
      } else {
        showMessage(t("errorMessage"), "error");
      }
    } catch (error) {
      showMessage(t("errorMessage"), "error");
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
        fontSize: "20px",
        backgroundColor: "#9457ff",
        ":hover": { backgroundColor: "#9457ff" },
        padding: "20px",
        borderRadius: "50px",
      }}
    >
      {t("payNow")}
    </Button>
  );
};

export default RegisterNow;
