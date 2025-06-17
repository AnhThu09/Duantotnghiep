// src/pages/SettingsPage.tsx
import React, { useState, SyntheticEvent, useContext, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Stack, Tabs, Tab, Snackbar, Alert, useTheme,
  FormControlLabel, Switch, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import KeyIcon from '@mui/icons-material/Key';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// IMPORT ThemeContext từ context mới
import { ThemeContext } from '../context/ThemeContext';

// Định nghĩa props cho TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

export default function SettingsPage() {
  const theme = useTheme();
  // Lấy toggleColorMode và mode từ ThemeContext
  const { toggleColorMode, mode } = useContext(ThemeContext);

  // State cho Tab đang hoạt động
  const [currentTab, setCurrentTab] = useState(0);

  // State cho form thông tin cá nhân
  const [profileData, setProfileData] = useState({
    name: 'Tên Người Dùng Hiện Tại',
    email: 'emailhientai@example.com',
  });

  // State cho form thay đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // State cho cài đặt thông báo, đọc từ localStorage
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');
    return savedNotifications ? JSON.parse(savedNotifications) : {
      emailNotifications: true,
      smsNotifications: false,
      appNotifications: true,
    };
  });

  // Effect để lưu cài đặt thông báo vào localStorage khi chúng thay đổi
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // State cho cài đặt hiển thị (khởi tạo với mode hiện tại từ context)
  // Không cần state displaySettings.themeMode riêng nữa vì nó được quản lý bởi context
  // và select box sẽ trực tiếp map tới 'mode' từ context.

  // State cho Snackbar thông báo
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // --- HANDLERS ---

  // Xử lý thay đổi Tab
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Xử lý thay đổi input của form thông tin cá nhân
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Xử lý thay đổi input của form mật khẩu
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Xử lý thay đổi cài đặt thông báo
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };

  // Xử lý thay đổi cài đặt hiển thị (gọi toggleColorMode từ context)
  const handleDisplayChange = (e: any) => {
    // Không cần setDisplaySettings nữa
    if (e.target.name === 'themeMode') {
      toggleColorMode(); // Gọi hàm toggle từ context
    }
  };

  // Xử lý lưu thông tin cá nhân
  const handleSaveProfile = () => {
    console.log('Lưu thông tin cá nhân:', profileData);
    // Gửi dữ liệu đến API
    setTimeout(() => {
      setSnackbarMessage('Thông tin cá nhân đã được cập nhật thành công!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 1000);
  };

  // Xử lý thay đổi mật khẩu
  const handleChangePassword = () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setSnackbarMessage('Vui lòng điền đầy đủ tất cả các trường.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSnackbarMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (newPassword.length < 6) {
        setSnackbarMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    console.log('Thay đổi mật khẩu:', { currentPassword, newPassword });
    // Gửi dữ liệu đến API
    setTimeout(() => {
      setSnackbarMessage('Mật khẩu đã được thay đổi thành công!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    }, 1000);
  };

  // Xử lý lưu cài đặt thông báo
  const handleSaveNotifications = () => {
    // Không cần gọi hàm này nữa vì useEffect đã tự động lưu vào localStorage
    // khi notificationSettings thay đổi
    setSnackbarMessage('Cài đặt thông báo đã được lưu thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Xử lý lưu cài đặt hiển thị (chỉ là nút để người dùng cảm thấy đã lưu)
  const handleSaveDisplaySettings = () => {
    // Theme mode đã được lưu bởi useEffect trong ThemeContext
    setSnackbarMessage('Cài đặt hiển thị đã được lưu thành công!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.dark }}>
        Cài đặt
      </Typography>

      <Paper sx={{ p: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[3], mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="settings tabs">
            <Tab label="Thông tin chung" icon={<AccountCircleIcon />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Bảo mật" icon={<KeyIcon />} iconPosition="start" {...a11yProps(1)} />
            <Tab label="Thông báo" icon={<NotificationsIcon />} iconPosition="start" {...a11yProps(2)} />
            <Tab label="Hiển thị" icon={mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />} iconPosition="start" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* Tab Panel: Thông tin chung */}
        <CustomTabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Cập nhật thông tin cá nhân
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Tên Người Dùng"
              name="name"
              variant="outlined"
              fullWidth
              value={profileData.name}
              onChange={handleProfileChange}
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              fullWidth
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              sx={{ alignSelf: 'flex-start' }}
            >
              Lưu thay đổi
            </Button>
          </Stack>
        </CustomTabPanel>

        {/* Tab Panel: Bảo mật */}
        <CustomTabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Thay đổi mật khẩu
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Mật khẩu hiện tại"
              name="currentPassword"
              variant="outlined"
              fullWidth
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              label="Mật khẩu mới"
              name="newPassword"
              variant="outlined"
              fullWidth
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              variant="outlined"
              fullWidth
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<KeyIcon />}
              onClick={handleChangePassword}
              sx={{ alignSelf: 'flex-start' }}
            >
              Đổi mật khẩu
            </Button>
          </Stack>
        </CustomTabPanel>

        {/* Tab Panel: Thông báo */}
        <CustomTabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Cài đặt thông báo
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  name="emailNotifications"
                />
              }
              label="Nhận thông báo qua Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationChange}
                  name="smsNotifications"
                />
                }
              label="Nhận thông báo qua SMS"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.appNotifications}
                  onChange={handleNotificationChange}
                  name="appNotifications"
                />
              }
              label="Nhận thông báo trong ứng dụng"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveNotifications}
              sx={{ alignSelf: 'flex-start', mt: 3 }}
            >
              Lưu cài đặt thông báo
            </Button>
          </Stack>
        </CustomTabPanel>

        {/* Tab Panel: Hiển thị */}
        <CustomTabPanel value={currentTab} index={3}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Cài đặt hiển thị và giao diện
          </Typography>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel id="theme-mode-select-label">Chế độ hiển thị</InputLabel>
              <Select
                labelId="theme-mode-select-label"
                id="theme-mode-select"
                value={mode} // Dùng 'mode' trực tiếp từ context
                label="Chế độ hiển thị"
                onChange={handleDisplayChange}
                name="themeMode"
              >
                <MenuItem value={'light'}>
                  <LightModeIcon sx={{ mr: 1 }} /> Chế độ sáng
                </MenuItem>
                <MenuItem value={'dark'}>
                  <DarkModeIcon sx={{ mr: 1 }} /> Chế độ tối
                </MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveDisplaySettings}
              sx={{ alignSelf: 'flex-start' }}
            >
              Lưu cài đặt hiển thị
            </Button>
          </Stack>
        </CustomTabPanel>
      </Paper>

      {/* Snackbar để thông báo */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}