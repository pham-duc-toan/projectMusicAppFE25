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

import Box from "@mui/material/Box";

import { useTheme } from "@emotion/react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("chartComponent");
  const theme = useTheme();
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          //@ts-ignore
          color: theme.palette.text.primary,
        },
      },
      title: {
        display: true,
        text: t("title"), // Sử dụng chuỗi dịch
        //@ts-ignore
        color: theme.palette.text.primary,
      },
    },
    scales: {
      x: {
        ticks: {
          //@ts-ignore
          color: theme.palette.text.primary,
        },
        grid: {
          //@ts-ignore
          color: theme.palette.text.primary,
        },
      },
      y: {
        ticks: {
          //@ts-ignore
          color: theme.palette.text.primary,
        },
        grid: {
          //@ts-ignore
          color: theme.palette.text.primary,
        },
      },
    },
  };

  return (
    <Box sx={{ height: 400, display: "flex", justifyContent: "center" }}>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default ChartComponent;
