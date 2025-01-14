import { Box } from "@mui/system";
import FormLoginComponent from "./components/form-login";

export default async function Login() {
  return (
    <Box
      sx={{
        height: "60vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormLoginComponent />
    </Box>
  );
}
