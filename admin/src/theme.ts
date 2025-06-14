import { createTheme } from '@mui/material/styles';

const nightOwlsTheme = createTheme({
  palette: {
    mode: 'light', // Hoặc 'dark' nếu bạn muốn một theme tối hoàn toàn
    primary: {
      main: '#2C3E50', // Xanh than sâu (Dark Slate Blue)
      light: '#4A6B8A', // Biến thể nhẹ hơn
      dark: '#1C2833',  // Biến thể tối hơn
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#DAA520', // Vàng đồng (Goldenrod) - sang trọng, điểm nhấn
      light: '#FFD700', // Vàng tươi hơn
      dark: '#B8860B',  // Vàng sẫm hơn
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFC107',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
    background: {
      default: '#F5F5F5', // Xám nhạt, gần như trắng ngà cho nền tổng thể
      paper: '#FFFFFF', // Nền cho Card, Paper
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: 'Georgia, serif', // Hoặc một font serif/elegant khác như "Playfair Display" (cần import từ Google Fonts)
    h4: {
      fontWeight: 700,
      fontSize: '2.1rem',
      '@media (max-width:600px)': {
        fontSize: '1.8rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle2: {
      fontSize: '0.85rem',
      color: '#888888',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

export default nightOwlsTheme;