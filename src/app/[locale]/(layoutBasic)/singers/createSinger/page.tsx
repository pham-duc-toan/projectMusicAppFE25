import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import { apiBasicServer } from "@/app/utils/request";
import { redirect } from "next/navigation";

import SingerCreateComponent from "./components/SingerCreateComponent";
import { getTranslations } from "next-intl/server";

const createPage = async () => {
  const t = await getTranslations("CreateSingerPage");

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
      <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>{t("title")}</h1>
      <SingerCreateComponent />
    </>
  );
};
export default createPage;
