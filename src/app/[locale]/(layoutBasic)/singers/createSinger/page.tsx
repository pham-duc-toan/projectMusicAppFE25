import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import { apiBasicServer } from "@/app/utils/request";

import { redirect } from "next/navigation";
import SingerCreateComponent from "./components/SingerCreateComponent";

const createPage = async () => {
  try {
    const accessToken = GetAccessTokenFromCookie();
    const res = await apiBasicServer(
      "GET",
      "/orders/checkUser/payment",
      undefined,
      undefined,
      accessToken
    );
    if (!res.data) {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }

  return (
    <>
      <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>Tạo ca sĩ</h1>
      <SingerCreateComponent />
    </>
  );
};
export default createPage;
