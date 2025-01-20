import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import RegisterNow from "./components/RegisterNow";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";

import DoneIcon from "@mui/icons-material/Done";

import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata.registerAsSinger",
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

export default async function HomePage() {
  const t = await getTranslations("homePage"); // Dùng useTranslations() cho Client Component
  GetAccessTokenFromCookie();

  return (
    <>
      <Box
        sx={{
          bgcolor: "#0e0025",
          minHeight: "100vh",
          color: "#fff",
          backgroundImage:
            "url('https://res.cloudinary.com/dsi9ercdo/image/upload/v1733305599/evxq6lp4uq8knafjejvn.png')", // Link hình nền
          backgroundSize: "cover",
          backgroundPosition: "center", // Canh giữa hình nền
          backgroundRepeat: "no-repeat", // Không lặp lại hình nền
          position: "relative", // Để overlay có thể hoạt động
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom,#170437, rgba(0, 0, 0, 0.8))",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{ py: 8, position: "relative", zIndex: 1 }}
        >
          {/* Header */}
          <Box sx={{ width: "560px", marginLeft: "auto", marginRight: "auto" }}>
            <Typography
              sx={{
                marginTop: "80px",
                fontWeight: "600",
                fontSize: { xs: "40px", sm: "50px", md: "60px" },
                lineHeight: { xs: "30px", sm: "40px", md: "60px" },
              }}
              variant="h3"
              gutterBottom
            >
              {t("unlimitedMusic1")}
              <Box sx={{ height: "20px" }} />
              {t("unlimitedMusic2")}
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontSize: "20px", color: "#FEFFFF99" }}
            >
              {t("upgradeAccount")}
            </Typography>
          </Box>

          {/* Plans */}
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
            {/* Plan Plus */}
            <Grid item xs={12} sm={6} md={6}>
              <Box
                sx={{
                  background:
                    "radial-gradient(139.39% 100% at 0% 0%,#4e2a8c 0%,rgba(78, 42, 140, 0.26) 100%)",
                  color: "white",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {t("becomeSinger")}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {t("price")}
                </Typography>
                <RegisterNow />
                <Divider sx={{ margin: "20px 0", background: "#6a6a6a" }} />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "700",
                    marginBottom: "8px",
                    textAlign: "left",
                  }}
                >
                  {t("specialPrivileges")}
                </Typography>
                <List sx={{ padding: 0 }}>
                  {[
                    t("privilege1"),
                    t("privilege2"),
                    t("privilege3"),
                    t("privilege4"),
                    t("privilege5"),
                  ].map((item, index) => (
                    <ListItem
                      key={index}
                      disableGutters
                      sx={{ padding: "4px 0" }}
                    >
                      <ListItemIcon sx={{ minWidth: "24px", color: "#a372f3" }}>
                        <DoneIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          marginLeft: "10px",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#FEFFFFCC",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
