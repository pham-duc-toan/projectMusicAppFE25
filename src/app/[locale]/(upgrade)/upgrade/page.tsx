import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import RegisterNow from "./components/RegisterNow";
import { GetAccessTokenFromCookie } from "@/app/utils/checkRole";
import DoneIcon from "@mui/icons-material/Done";
export const metadata = {
  title: "Nâng cấp tài khoản",
};

export default function HomePage() {
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
            position: "absolute", // Để overlay nằm trên hình nền
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom,#170437, rgba(0, 0, 0, 0.8))", // Gradient tím
          }}
        />
        <Container
          maxWidth="lg"
          sx={{ py: 8, textAlign: "center", position: "relative", zIndex: 1 }}
        >
          {/* Header */}
          <Typography
            sx={{
              fontWeight: "600",
              xs: {
                fontSize: "36px",
                lineHeight: "44px",
              },
              sm: {
                fontSize: "50px",
                lineHeight: "55px",
              },
              md: {
                fontSize: "60px",
                lineHeight: "70px",
              },
            }}
            variant="h2"
            component="h1"
            gutterBottom
          >
            Âm nhạc
            <br />
            không giới hạn
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Nâng cấp tài khoản để trải nghiệm các tính năng và nội dung cao cấp
          </Typography>

          {/* Plans */}
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
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
                  Trở thành ca sĩ
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Với 289,000đ
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
                  Đặc quyền đặc biệt:
                </Typography>
                <List sx={{ padding: 0 }}>
                  {[
                    "Lưu trữ những bài nhạc của chính mình",
                    "Mọi người có thể thưởng thức bài nhạc của bạn",
                    "Lưu trữ nhạc không giới hạn",
                    "Tính năng nghe nhạc nâng cao",
                    "Mở rộng khả năng Upload",
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
