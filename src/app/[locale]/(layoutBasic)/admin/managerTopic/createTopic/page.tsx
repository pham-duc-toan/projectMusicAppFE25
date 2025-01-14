import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "@/i18n/routing";
import TopicCreateComponent from "./components/TopicCreateComponent";

const createPage = () => {
  return (
    <>
      <Box
        mb={"20px"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>
          Tạo chủ đề mới
        </h1>
        <Button variant="contained">
          <Link href={"/admin/managerTopic"}>Quản lý chủ đề</Link>
        </Button>
      </Box>
      <TopicCreateComponent />
    </>
  );
};
export default createPage;
