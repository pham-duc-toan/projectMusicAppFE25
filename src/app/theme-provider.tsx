"use client";
import "@fontsource/inter"; // Import toàn bộ font Inter
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import {
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1920,
    },
  },

  shape: {
    borderRadius: 10,
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },

  // Sử dụng font Inter toàn cục
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    button: {
      fontFamily: "'Inter', sans-serif",
    },
  },

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#8479F2",
          contrastText: "#fff",
          A100: "#fff",
        },
        text: {
          primary: "#9A52A0",
          secondary: "#7e3f83",
        },
        secondary: {
          main: "#F6F6F3",
          A100: "#ebebeb",
          A200: "#F8EEC5",
          A400: "#807e81",
          A700: "#9A52A0",
        },
        background: {
          default: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#9b4de0",
          contrastText: "#fff",
          A100: "#17002b",
        },
        text: {
          primary: "#fff",
          secondary: "#F6F6F3",
        },
        secondary: {
          main: "#090018",
          A100: "#1b0c35",
          A200: "#E7C97E",
          A400: "#fff",
          A700: "#9A52A0",
        },
        background: {
          default: "#0e0025",
          paper: "#2A2A40",
        },
      },
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif", // Áp dụng font Inter cho toàn bộ ứng dụng
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        body: {
          fontFamily: "'Inter', sans-serif", // Font body
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
          "&::-webkit-scrollbar": {
            width: "3px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Màu mặc định
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Màu khi hover
          },
        },
        "[data-mui-color-scheme='dark'] body": {
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255, 255, 255, 0.4)", // Màu scrollbar trong dark mode
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Hover trong dark mode
          },
        },

        "#__next": {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          padding: "10 25 10 25",
          textTransform: "none",
          fontFamily: "'Inter', sans-serif", // Font cho button
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "#fff",
          fontFamily: "'Inter', sans-serif", // Font cho link
        },
      },
    },
  },
});

export default theme;

export function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <CssVarsProvider defaultMode="system" theme={theme}>
        {children}
      </CssVarsProvider>
    </Provider>
  );
}
