import { apiBasicServer } from "@/app/utils/request";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import ItemControlCardSinger from "./components/ItemControlCardSinger";
import { getTranslations } from "next-intl/server";

const AllSingers = async () => {
  const t = await getTranslations("AllSingers");

  // Gọi API để lấy danh sách tất cả ca sĩ
  const datall: any = await apiBasicServer(
    "GET",
    "/singers/client", // Endpoint lấy danh sách ca sĩ
    { sort: "-createdAt" },
    undefined,
    undefined,
    ["revalidate-tag-singers", "revalidate-tag-songs"]
  );

  const datas = datall?.data || []; // Lấy dữ liệu ca sĩ từ API

  return (
    <>
      <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>{t("title")}</h1>
      <Grid container>
        {datas.length > 0 ? (
          datas.map((data: any, index: number) => (
            <Grid md={4} sm={6} xs={12} key={index}>
              <Box sx={{ padding: "10px" }}>
                {/* Hiển thị thông tin ca sĩ */}
                <ItemControlCardSinger data={data} />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
              {t("noSingers")}
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AllSingers;
