<<<<<<< HEAD
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeContextProvider } from './context/ThemeContext'; // Import ThemeContextProvider
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // File CSS toàn cục (có thể trống)
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material"; // Thêm CssBaseline ở đây để reset CSS mặc định
import { SnackbarProvider } from "./context/SnackbarContext.tsx";

// Tùy chỉnh theme cơ bản cho Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Màu xanh dương đậm
    },
    secondary: {
      main: "#dc004e", // Màu hồng
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Font chữ mặc định
  },
});
>>>>>>> a87fa716c740314f879e638477deb1ca452fc757

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<<<<<<< HEAD
    <ThemeContextProvider> 
      <App />
    </ThemeContextProvider>
  </React.StrictMode>,
);
=======
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Đặt CssBaseline bên trong ThemeProvider */}
        <App />
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
>>>>>>> a87fa716c740314f879e638477deb1ca452fc757
