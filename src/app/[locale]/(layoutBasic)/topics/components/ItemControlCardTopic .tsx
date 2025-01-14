"use client";
import * as React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "@/i18n/routing";
import Image from "next/image";

// Định nghĩa kiểu dữ liệu Topic để sử dụng trong component
interface Topic {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  status: string;
  slug: string;
  deleted: boolean;
  songsCount: number;
}

export default function ItemControlCardTopic({
  data,
}: {
  data: Topic; // Sử dụng kiểu dữ liệu Topic
}) {
  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <CardContent sx={{ flex: "1 0 auto", padding: "32px 24px 0 24px" }}>
          {/* Hiển thị tên topic */}
          <Typography
            component="div"
            variant="h5"
            height={"100px"}
            sx={{
              fontSize: "20px",
              lineHeight: "1.3",
              height: "78px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              wordWrap: "break-word",
            }}
          >
            <Link href={`/topics/detail/${data.slug}`}>{data.title}</Link>
          </Typography>

          {/* Hiển thị số lượng bài hát trong topic */}
          <Typography variant="body2" color="text.secondary">
            {data.songsCount || 0} bài hát
          </Typography>
        </CardContent>
      </Box>

      {/* Hiển thị ảnh đại diện của topic */}
      <Image
        src={data.avatar}
        alt={data.title}
        width={210}
        height={210}
        style={{ objectFit: "cover" }}
        priority
      />
    </Card>
  );
}
