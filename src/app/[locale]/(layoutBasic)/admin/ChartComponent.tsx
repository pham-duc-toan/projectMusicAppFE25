"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";

// Đăng ký các module của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data }: { data: any }) => {
  const theme = useTheme();
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          //@ts-ignore
          color: theme.palette.text.primary, // Màu chữ của legend
        },
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu theo tháng",
        //@ts-ignore
        color: theme.palette.text.primary, // Màu chữ của title
      },
    },
    scales: {
      x: {
        ticks: {
          //@ts-ignore
          color: theme.palette.text.primary, // Màu chữ của các nhãn trên trục x
        },
        grid: {
          //@ts-ignore
          color: theme.palette.text.primary, // Màu các đường kẻ của trục x
        },
      },
      y: {
        ticks: {
          //@ts-ignore
          color: theme.palette.text.primary, // Màu chữ của các nhãn trên trục y
        },
        grid: {
          //@ts-ignore
          color: theme.palette.text.primary, // Màu các đường kẻ của trục y
        },
      },
    },
  };

  return (
    <Box sx={{ height: 400 }}>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default ChartComponent;
