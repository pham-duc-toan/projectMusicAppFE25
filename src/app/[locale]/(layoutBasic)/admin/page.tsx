import React from "react";
import { Container, Typography } from "@mui/material";
import ChartComponent from "./ChartComponent";
import { apiBasicServer } from "@/app/utils/request";
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}
const AdminPage = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Lấy tháng hiện tại (0-based, cần +1)
  const currentYear = currentDate.getFullYear();

  let chartData: ChartData = {
    labels: [],
    datasets: [
      {
        label: "Doanh thu (Triệu VND)",
        data: [],
        backgroundColor: "#9b4de0",
      },
    ],
  };

  try {
    const labels: string[] = [];
    const dataset: number[] = [];

    for (let i = 0; i < 6; i++) {
      // Tính toán tháng và năm
      const month =
        currentMonth - i <= 0 ? currentMonth - i + 12 : currentMonth - i;
      const year = currentMonth - i <= 0 ? currentYear - 1 : currentYear;

      // Gọi API từng tháng
      const res = await apiBasicServer(
        "GET",
        `/orders/month/${year}/${month}`,
        { resultCode: "0" },
        undefined,
        undefined,
        ["revalidate-tag-orders"]
      );
      const doanhThuThang = (res.data.length || 0) * 0.289; // Công thức tính doanh thu

      // Đẩy dữ liệu vào labels và dataset
      labels.unshift(`Tháng ${month}/${year}`); // Thêm nhãn vào đầu mảng
      dataset.unshift(parseFloat(doanhThuThang.toFixed(2))); // Làm tròn doanh thu và thêm vào đầu mảng
    }

    // Cập nhật chartData với dữ liệu vừa lấy
    chartData = {
      labels,
      datasets: [
        {
          label: "Doanh thu (Triệu VND)",
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
        Trang Chủ Admin
      </Typography>
      <ChartComponent data={chartData} />
    </Container>
  );
};

export default AdminPage;
