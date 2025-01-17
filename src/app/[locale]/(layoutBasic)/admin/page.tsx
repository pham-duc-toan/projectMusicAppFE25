import React from "react";
import { Box, Container, Typography } from "@mui/material";
import ChartComponent from "./ChartComponent";
import { apiBasicServer } from "@/app/utils/request";
import { getTranslations } from "next-intl/server";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

const AdminPage = async () => {
  const t = await getTranslations("adminPage"); // Lấy t bằng getTranslations
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  let chartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: t("chart.label"), // Thay chuỗi cứng bằng t
        data: [],
        backgroundColor: "#9b4de0",
      },
    ],
  };

  try {
    const labels: string[] = [];
    const dataset: number[] = [];

    for (let i = 0; i < 6; i++) {
      const month =
        currentMonth - i <= 0 ? currentMonth - i + 12 : currentMonth - i;
      const year = currentMonth - i <= 0 ? currentYear - 1 : currentYear;

      const res = await apiBasicServer(
        "GET",
        `/orders/month/${year}/${month}`,
        { resultCode: "0" },
        undefined,
        undefined,
        ["revalidate-tag-orders"]
      );
      const doanhThuThang = (res.data.length || 0) * 0.289;

      // Sử dụng t để format tháng/năm
      labels.unshift(t("chart.monthYear", { month, year }));
      dataset.unshift(parseFloat(doanhThuThang.toFixed(2)));
    }

    chartData = {
      labels,
      datasets: [
        {
          label: t("chart.label"),
          data: dataset,
          backgroundColor: "#9b4de0",
        },
      ],
    };
  } catch (error) {
    console.error("Failed to fetch revenue data:", error);
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t("title")}
      </Typography>
      <ChartComponent data={chartData} />
    </Container>
  );
};

export default AdminPage;
