// src/pages/Account.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, CircularProgress, Snackbar,
  Stack, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, IconButton, Alert as MuiAlertOriginal // ✅ Đổi tên import Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth

// ✅ Sửa lỗi: Custom Alert component cho Snackbar. Đảm bảo gọi MuiAlertOriginal.
const MuiAlert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlertOriginal elevation={6} ref={ref} variant="filled" {...props} />;
});

// Định nghĩa lại cấu trúc User để sử dụng trong form
interface UserFormData {
  full_name: string;
  email: string; // Email không thay đổi
  phone_number: string;
  gender: string; // ENUM('Nam', 'Nữ', 'Khác')
  date_of_birth: string; // Format YYYY-MM-DD
  address: string;
  ward: string;
  district: string;
  province: string;
  // Các trường khác nếu có
}

const Account = () => {
  const { currentUser, logout, updateUser } = useAuth(); // Lấy currentUser và hàm logout, updateUser từ context
  
  // State cho dữ liệu form, khởi tạo giá trị mặc định để tránh undefined
  const [formData, setFormData] = useState<UserFormData>({
    full_name: '',
    email: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    address: '',
    ward: '',
    district: '',
    province: '',
  });

  // State cho mật khẩu mới và xác nhận mật khẩu (cho chức năng đổi mật khẩu)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false); // State mở dialog đổi mật khẩu

  // Lấy dữ liệu user từ context để điền vào form khi component mount hoặc currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '', // Email cố định
        phone_number: currentUser.phone_number || '',
        gender: currentUser.gender || '',
        // ✅ Cải tiến: Xử lý date_of_birth có thể là null hoặc undefined
        date_of_birth: currentUser.date_of_birth 
          ? new Date(currentUser.date_of_birth).toISOString().split('T')[0] 
          : '', // Format YYYY-MM-DD
        address: currentUser.address || '',
        ward: currentUser.ward || '',
        district: currentUser.district || '',
        province: currentUser.province || '',
      });
    }
  }, [currentUser]); // Dependency array đảm bảo effect chạy khi currentUser thay đổi

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm cập nhật thông tin người dùng
  const handleUpdateProfile = async () => {
    // ✅ VALIDATION: Kiểm tra các trường bắt buộc
    // Kiểm tra các trường quan trọng nhất, các trường khác có thể để trống
    if (!formData.full_name || !formData.phone_number) { 
      setSnackbar({ open: true, message: 'Họ tên và Số điện thoại không được để trống.', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Gửi request PUT đến backend để cập nhật thông tin user
      const res = await axios.put('http://localhost:3000/api/auth/me', formData); // Endpoint /api/auth/me
      
      // ✅ Cập nhật thông tin user trong context ngay lập tức
      // Đảm bảo res.data.user khớp với User interface của bạn
      if (res.data.user) {
        updateUser(res.data.user); 
      }
      
      setSnackbar({ open: true, message: res.data.message || 'Cập nhật thông tin thành công!', severity: 'success' });
    } catch (error: any) {
      console.error('Lỗi cập nhật thông tin:', error.response?.data || error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Cập nhật thông tin thất bại.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Hàm đổi mật khẩu
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setSnackbar({ open: true, message: 'Vui lòng điền đủ Mật khẩu hiện tại, Mật khẩu mới và Xác nhận mật khẩu mới.', severity: 'warning' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSnackbar({ open: true, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.', severity: 'warning' });
      return;
    }
    if (newPassword.length < 6) { // Yêu cầu tối thiểu 6 ký tự
      setSnackbar({ open: true, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Gửi request POST đến backend để đổi mật khẩu
      const res = await axios.post('http://localhost:3000/api/auth/change-password', {
        email: currentUser?.email, // Gửi email để backend tìm user
        current_password: currentPassword, // Mật khẩu cũ
        new_password: newPassword, // Mật khẩu mới
      });
      
      setSnackbar({ open: true, message: res.data.message || 'Đổi mật khẩu thành công!', severity: 'success' });
      setOpenChangePasswordDialog(false); // Đóng dialog
      setCurrentPassword(''); // Reset form mật khẩu
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (error: any) {
      console.error('Lỗi đổi mật khẩu:', error.response?.data || error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Đổi mật khẩu thất bại.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress /> {/* Hiển thị loading spinner trong khi chờ user data */}
        <Typography variant="h6" ml={2}>Đang tải thông tin người dùng...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 4, bgcolor: '#fdf9ef', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">Quản lý tài khoản</Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Thông tin cá nhân</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Họ và tên"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
              required // Đánh dấu là trường bắt buộc về mặt UX
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email (Không thể thay đổi)"
              name="email"
              value={formData.email}
              disabled // Email không thay đổi
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={loading}
              required // Đánh dấu là trường bắt buộc về mặt UX
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Giới tính</InputLabel>
              <Select
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleChange as any} // Cast để chấp nhận SelectChangeEvent
              >
                <MenuItem value="">Chọn giới tính</MenuItem> {/* Thêm tùy chọn trống */}
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày sinh"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Địa chỉ chi tiết"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phường/Xã"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quận/Huyện"
              name="district"
              value={formData.district}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Tỉnh/Thành phố"
              name="province"
              value={formData.province}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ mt: 3, bgcolor: '#1e1e1c', color: '#fff', py: 1, fontWeight: 'bold' }}
          onClick={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "CẬP NHẬT THÔNG TIN"}
        </Button>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Bảo mật tài khoản</Typography>
        <Button
          variant="outlined"
          sx={{ color: '#1e1e1c', borderColor: '#1e1e1c', py: 1, fontWeight: 'bold' }}
          onClick={() => setOpenChangePasswordDialog(true)}
          disabled={loading}
        >
          ĐỔI MẬT KHẨU
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ ml: 2, py: 1, fontWeight: 'bold' }}
          onClick={logout} // Hàm logout từ AuthContext
          disabled={loading}
        >
          ĐĂNG XUẤT
        </Button>
      </Paper>

      {/* Dialog Đổi mật khẩu */}
      <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          Đổi mật khẩu
          <IconButton
            aria-label="close"
            onClick={() => setOpenChangePasswordDialog(false)}
            sx={{
              position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth label="Mật khẩu hiện tại" type="password"
              value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={loading}
            />
            <TextField
              fullWidth label="Mật khẩu mới" type="password"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading}
            />
            <TextField
              fullWidth label="Xác nhận mật khẩu mới" type="password"
              value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={loading}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordDialog(false)} color="secondary">Hủy</Button>
          <Button variant="contained" onClick={handleChangePassword} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "XÁC NHẬN"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        {/* ✅ Sử dụng component MuiAlert tùy chỉnh đã sửa lỗi */}
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Account;