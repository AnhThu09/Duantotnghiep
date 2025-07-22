import React, { useState } from 'react'; // ✅ Import React và useState
import { useNavigate, Link } from 'react-router-dom'; // ✅ Import useNavigate và Link
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Stack,
  CircularProgress, // ✅ Import CircularProgress
  Snackbar,         // ✅ Import Snackbar
  Alert as MuiAlert, // ✅ Import Alert và đổi tên để tránh xung đột
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth

// Component Alert tùy chỉnh cho Snackbar
const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginPage = () => {
  // --- STATE QUẢN LÝ FORM VÀ TRẠNG THÁI ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State ẩn/hiện mật khẩu
  const [loading, setLoading] = useState(false); // State loading cho nút đăng nhập

  const navigate = useNavigate(); // Hook để điều hướng
  const { login: authLogin, isAuthenticated, loadingAuth } = useAuth(); // ✅ Lấy trạng thái từ AuthContext

  // State cho Snackbar thông báo
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // --- HÀM HỖ TRỢ HIỂN THỊ SNACKBAR ---
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // --- VALIDATION PHÍA FRONTEND ---
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 6; // Ví dụ: Mật khẩu tối thiểu 6 ký tự

  // --- useEffect ĐỂ CHUYỂN HƯỚNG NẾU ĐÃ ĐĂNG NHẬP ---
  React.useEffect(() => {
    // Chỉ chuyển hướng nếu không còn trong trạng thái loadingAuth (kiểm tra ban đầu đã xong)
    // VÀ người dùng đã được xác thực (isAuthenticated là true)
    if (!loadingAuth && isAuthenticated) {
      navigate('/'); // Chuyển hướng về trang chủ
      // Hoặc navigate('/account'); nếu chị muốn họ luôn về trang quản lý tài khoản
    }
  }, [isAuthenticated, loadingAuth, navigate]); // Dependency array: hàm sẽ chạy lại khi các giá trị này thay đổi

  // --- HÀM XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async () => {
    // 1. Validation cơ bản trên frontend
    if (!email) {
      setSnackbar({ open: true, message: 'Vui lòng nhập email!', severity: 'warning' });
      return;
    }
    if (!isValidEmail(email)) {
      setSnackbar({ open: true, message: 'Email không hợp lệ!', severity: 'warning' });
      return;
    }
    if (!password) {
      setSnackbar({ open: true, message: 'Vui lòng nhập mật khẩu!', severity: 'warning' });
      return;
    }
    if (!isValidPassword(password)) {
      setSnackbar({ open: true, message: 'Mật khẩu phải có ít nhất 6 ký tự!', severity: 'warning' });
      return;
    }

    setLoading(true); // Bắt đầu loading
    try {
      // Gửi request POST đến backend để đăng nhập
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password_hash: password, // Đảm bảo backend của bạn nhận `password_hash`
      });

      const token = res.data.token;
      const user = res.data.user; // Backend cần trả về object user đầy đủ (user_id, full_name, email, role, ...)

      // ✅ Gọi hàm login từ AuthContext để lưu trạng thái đăng nhập vào context và localStorage
      authLogin(token, user);

      setSnackbar({ open: true, message: 'Đăng nhập thành công!', severity: 'success' });

    } catch (err: any) { // Bắt lỗi để hiển thị thông báo từ backend
      console.error('Lỗi đăng nhập:', err);
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      if (err.response) {
        // Lỗi từ phản hồi của server (ví dụ: 400 Bad Request, 401 Unauthorized, 404 Not Found)
        errorMessage = err.response.data?.message || err.response.statusText;
      } else if (err.request) {
        // Request đã được gửi nhưng không nhận được phản hồi (ví dụ: server không chạy)
        errorMessage = 'Không nhận được phản hồi từ server. Đảm bảo backend đang chạy.';
      } else {
        // Lỗi xảy ra khi thiết lập request
        errorMessage = err.message;
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'error' }); // Hiển thị lỗi
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // --- JSX (Giao diện người dùng của trang đăng nhập) ---
  return (
    <Box
      sx={{
        maxWidth: 400, // Chiều rộng tối đa của form
        mx: 'auto',    // Căn giữa theo chiều ngang
        mt: 16,         // Margin top
        mb: 8,         // Margin bottom
        p: 4,          // Padding bên trong
        bgcolor: '#fdf9ef', // Màu nền
        borderRadius: 2, // Bo tròn góc
        boxShadow: 3,    // Đổ bóng
      }}
    >
      <Typography variant="h6" fontWeight="bold">Đăng nhập</Typography>
      <Typography variant="h5" mt={1} mb={2} fontWeight="bold" color="text.primary">
        Night Owls chào bạn trở lại.
      </Typography>
      <Typography variant="body2" mb={2}>
        Bạn chưa có tài khoản?{' '}
        {/* ✅ Liên kết đến trang đăng ký */}
        <Typography
          component={Link} // Sử dụng Link từ react-router-dom
          to="/register"   // Đường dẫn đến trang đăng ký
          sx={{
            color: '#b38b40', // Màu chữ
            cursor: 'pointer', // Con trỏ chuột hình bàn tay
            textDecoration: 'none', // Bỏ gạch chân mặc định
            fontWeight: 'bold',      // Chữ đậm
            '&:hover': {
              textDecoration: 'underline' // Gạch chân khi hover
            }
          }}
        >
          Tạo tài khoản
        </Typography>
      </Typography>

      {/* Trường nhập Email */}
      <TextField
        fullWidth // Chiếm toàn bộ chiều rộng
        variant="standard" // Kiểu input đơn giản
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{ // Props cho Input
          startAdornment: ( // Icon ở đầu input
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }} // Margin bottom
        disabled={loading} // Vô hiệu hóa khi loading
        helperText={email && !isValidEmail(email) ? "Email không hợp lệ" : ""} // Text hỗ trợ/lỗi
        error={email && !isValidEmail(email) ? true : false} // Trạng thái lỗi
      />

      {/* Trường nhập Mật khẩu */}
      <TextField
        fullWidth
        variant="standard"
        placeholder="Nhập mật khẩu"
        type={showPassword ? 'text' : 'password'} // Thay đổi type để ẩn/hiện mật khẩu
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: ( // Icon ở cuối input để toggle show/hide password
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        disabled={loading}
        helperText={password && !isValidPassword(password) ? "Mật khẩu phải có ít nhất 6 ký tự" : ""}
        error={password && !isValidPassword(password) ? true : false}
      />

      {/* Phần "Ghi nhớ mật khẩu" và "Quên mật khẩu?" */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <FormControlLabel
          control={<Checkbox sx={{ color: '#b38b40' }} />}
          label="Ghi nhớ mật khẩu cho lần sau"
          disabled={loading}
        />
        {/* ✅ Liên kết đến trang quên mật khẩu */}
        <Typography
          variant="body2"
          component={Link} // Sử dụng Link từ react-router-dom
          to="/forgot-password" // Đường dẫn đến trang quên mật khẩu
          sx={{
            color: '#b38b40',
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          disabled={loading}
        >
          Quên mật khẩu?
        </Typography>
      </Box>

      {/* Nút ĐĂNG NHẬP */}
      <Button
        fullWidth
        variant="contained"
        sx={{ bgcolor: '#1e1e1c', color: '#fff', py: 1.5, fontWeight: 'bold', mb: 2 }}
        onClick={handleLogin}
        disabled={loading} // Vô hiệu hóa nút khi loading
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "ĐĂNG NHẬP"}
      </Button>

      {/* Phần "Hoặc đăng nhập bằng" và các icon mạng xã hội */}
      <Typography align="center" mb={2}>Hoặc đăng nhập bằng</Typography>

      <Stack direction="row" justifyContent="center" spacing={3}>
        <IconButton disabled={loading}><AppleIcon /></IconButton>
        <IconButton disabled={loading}><GoogleIcon sx={{ color: 'red' }} /></IconButton>
        <IconButton disabled={loading}><FacebookIcon sx={{ color: '#3b5998' }} /></IconButton>
      </Stack>

      {/* Snackbar để hiển thị thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
