import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { Link } from "@/i18n/routing";
import TopicCreateComponent from "./components/TopicCreateComponent";
import { getTranslations } from "next-intl/server";

const createPage = async () => {
  const t = await getTranslations("createPage");

  return (
    <>
      <Box
        mb={"20px"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>
          {t("title")}
        </h1>
        <Button variant="contained">
          <Link href={"/admin/managerTopic"}>{t("button")}</Link>
        </Button>
      </Box>
      <TopicCreateComponent />
    </>
  );
};

export default createPage;
