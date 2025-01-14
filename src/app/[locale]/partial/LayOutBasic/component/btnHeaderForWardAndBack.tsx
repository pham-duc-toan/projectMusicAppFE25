"use client";
import { IconButton, Grid, Box } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

export default function NavigationButtons() {
  const handleBackClick = () => {
    // Logic để quay lại trang trước
    window.history.back();
  };

  const handleForwardClick = () => {
    // Logic để tiến tới trang tiếp theo, nếu có
    window.history.forward();
  };

  return (
    <Box
      sx={{
        display: {
          md: "flex",
          xs: "none",
        },
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        {/* Nút quay lại (back) */}
        <Grid item>
          <IconButton onClick={handleBackClick}>
            <ArrowBack />
          </IconButton>
        </Grid>

        {/* Nút tiến tới (forward) */}
        <Grid item>
          <IconButton onClick={handleForwardClick}>
            <ArrowForward />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
