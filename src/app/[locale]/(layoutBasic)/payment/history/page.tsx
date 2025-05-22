import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import { apiBasicServer } from "@/app/utils/request";
import { decodeToken } from "@/app/helper/jwt";
import { redirect } from "next/navigation";
import RefreshIcon from "./components/RefreshIcon";

import PaymentIcon from "@mui/icons-material/Payment";

import { revalidateByTag } from "@/app/action";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface Order {
  id: string;
  orderId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  shortLink: string;
  resultCode: string;
}
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.manageTransactions",
  });

  return {
    title: `${t("detailTitle")}`,
    description: t("detailDescription"),
    openGraph: {
      title: t("detailTitle"),
      description: t("detailDescription"),
      images: [
        "https://res.cloudinary.com/dsi9ercdo/image/upload/v1733296299/xnwsxfhvkgsy3njpsyat.png",
      ],
      type: "website",
    },
  };
}
const HistoryTable = async () => {
  const t = await getTranslations("HistoryTable");

  let orders = [];
  const accessToken = GetAccessTokenFromCookie();
  const info = decodeToken(accessToken.value || undefined);
  try {
    await revalidateByTag("revalidate-tag-orders");
    const res = await apiBasicServer(
      "GET",
      `/orders/${info?.id}`,
      undefined,
      undefined,
      undefined,
      ["revalidate-tag-orders"]
    );

    orders = res?.data || [];
  } catch (error) {
    redirect("/");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "30px", marginTop: "40px" }}>{t("title")}</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("columns.orderId")}</TableCell>
              <TableCell>{t("columns.orderStatus")}</TableCell>
              <TableCell>{t("columns.singerStatus")}</TableCell>
              <TableCell>{t("columns.createdAt")}</TableCell>
              <TableCell>{t("columns.updatedAt")}</TableCell>
              <TableCell>{t("columns.action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.message}</TableCell>
                  <TableCell>
                    {order.status === "init"
                      ? t("status.notCreated")
                      : t("status.created")}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(order.updatedAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    {new Date(order.updatedAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <RefreshIcon orderId={order?.orderId || ""} />
                      {order.resultCode === "1000" ? (
                        <Link href={order?.shortLink || "/"} passHref>
                          <Tooltip title={t("actions.payNow")}>
                            <IconButton>
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      ) : null}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" fontStyle="italic">
                    {t("noOrders")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HistoryTable;
