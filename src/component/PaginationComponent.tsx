"use client";

import React from "react";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface PaginationComponentProps {
  totalPages: number; // Tổng số trang
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalPages,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("PaginationComponent");

  // Lấy giá trị page từ URL (mặc định là 1 nếu không có)
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    router.push(`?page=${page}`); // Thêm hoặc thay đổi query `page` trong URL
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 2,
        padding: 2,
        backgroundColor: "background.default",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{ color: "text.primary", marginRight: "20px" }}
      >
        {t("currentPage", { currentPage, totalPages })}
      </Typography>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        variant="outlined"
        shape="rounded"
        size="large"
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            href={`?page=${item.page}`}
            {...item}
          />
        )}
        sx={{
          "& .MuiPaginationItem-root": {
            padding: "10px 15px",
          },
        }}
      />
    </Box>
  );
};

export default PaginationComponent;
