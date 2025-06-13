import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // File CSS toàn cục (có thể trống)
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; // Thêm CssBaseline ở đây để reset CSS mặc định

// Tùy chỉnh theme cơ bản cho Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Màu xanh dương đậm
    },
    secondary: {
      main: '#dc004e', // Màu hồng
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Font chữ mặc định
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Đặt CssBaseline bên trong ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);