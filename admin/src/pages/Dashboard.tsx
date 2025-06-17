import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  useTheme,
  styled,
  Slide,
  Zoom,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip, // Added Chip for order status
} from '@mui/material';
// Icons cho KPIs
import PeopleIcon from '@mui/icons-material/People'; // Tổng người dùng
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; // Người dùng đăng ký mới
import HowToRegIcon from '@mui/icons-material/HowToReg'; // Người dùng hoạt động
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Đơn hàng mới
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Doanh thu hôm nay
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Sản phẩm tồn kho
import RefreshIcon from '@mui/icons-material/Refresh'; // Refresh icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon cho đơn hàng hoàn thành
import PendingActionsIcon from '@mui/icons-material/PendingActions'; // Icon cho đơn hàng đang xử lý
import CancelIcon from '@mui/icons-material/Cancel'; // Icon cho đơn hàng đã hủy

import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  DoughnutController,
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  DoughnutController
);

// Styled Components with Transitions
const StatCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: theme.shadows[8],
  },
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '350px', // Đặt minHeight cố định để các chart có không gian
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Dashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // --- Dữ liệu giả định mới và cập nhật cho Dashboard Mỹ phẩm Night Owls ---

  const stats = [
    { title: 'Tổng Người dùng', value: '15,234', icon: <PeopleIcon sx={{ fontSize: 35, color: theme.palette.primary.main }} /> },
    { title: 'Đăng ký mới (tháng này)', value: '185', icon: <PersonAddAlt1Icon sx={{ fontSize: 35, color: theme.palette.info.main }} /> }, // New KPI
    { title: 'Người dùng hoạt động (hôm nay)', value: '720', icon: <HowToRegIcon sx={{ fontSize: 35, color: theme.palette.secondary.main }} /> }, // New KPI
    { title: 'Đơn hàng mới (hôm nay)', value: '56', icon: <ShoppingCartIcon sx={{ fontSize: 35, color: theme.palette.success.main }} /> },
    { title: 'Doanh thu hôm nay', value: '15.000.000 VND', icon: <MonetizationOnIcon sx={{ fontSize: 35, color: theme.palette.warning.main }} /> },
    { title: 'Sản phẩm tồn kho', value: '250', icon: <Inventory2Icon sx={{ fontSize: 35, color: theme.palette.error.main }} /> }, // Updated icon color
  ];

  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [65000000, 59000000, 80000000, 81000000, 76000000, 92000000], // Updated data for realism
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const productData = {
    labels: ['Chăm sóc da', 'Trang điểm', 'Chăm sóc tóc', 'Nước hoa', 'Dụng cụ'], // More general categories for beauty
    datasets: [
      {
        label: 'Doanh thu theo danh mục (VND)', // Changed label for clarity
        data: [120000000, 80000000, 50000000, 70000000, 30000000], // Updated data
        backgroundColor: [
          theme.palette.info.light,    // Chăm sóc da
          theme.palette.success.light, // Trang điểm
          theme.palette.warning.light, // Chăm sóc tóc
          theme.palette.secondary.light, // Nước hoa
          theme.palette.primary.light,   // Dụng cụ
        ],
        borderColor: [
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.secondary.main,
          theme.palette.primary.main,
        ],
        borderWidth: 1,
      },
    ],
  };

  // New chart data for user registration/login
  const userActivityData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Người dùng đăng ký mới',
        data: [25, 30, 18, 40],
        backgroundColor: theme.palette.success.main,
        borderColor: theme.palette.success.dark,
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Người dùng đăng nhập',
        data: [150, 180, 160, 200],
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const userActivityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        bodyColor: theme.palette.text.primary,
        titleColor: theme.palette.primary.main,
        titleFont: { weight: 'bold' },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + ' người';
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary, font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: theme.palette.text.secondary, font: { size: 12 } },
        grid: { color: theme.palette.divider },
      },
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: { size: 14 },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        bodyColor: theme.palette.text.primary,
        titleColor: theme.palette.primary.main,
        titleFont: { weight: 'bold' },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('vi-VN') + ' VND';
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary, font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
          font: { size: 12 },
          callback: function (value) {
            return (value as number / 1000000).toFixed(0) + ' Tr VND'; // Display in millions for better readability
          },
        },
        grid: { color: theme.palette.divider },
      },
    },
  };

  const productOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: theme.palette.text.primary,
          font: { size: 14 },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        bodyColor: theme.palette.text.primary,
        titleColor: theme.palette.primary.main,
        titleFont: { weight: 'bold' },
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) { label += ': '; }
            if (context.parsed !== null) {
              const dataset = context.dataset;
              const total = dataset.data.reduce((previousValue, currentValue) => previousValue + (currentValue as number), 0);
              const currentValue = dataset.data[context.dataIndex] as number;
              const percentage = ((currentValue / total) * 100).toFixed(1); // One decimal for percentage
              label = label + currentValue.toLocaleString('vi-VN') + ' VND (' + percentage + '%)';
            }
            return label;
          },
        },
      },
    },
  };

  // Dữ liệu đơn hàng giả định chi tiết hơn
  const recentOrders = [
    { id: 1, orderId: 'NO-ORD001', customer: 'Nguyễn Thu Trang', product: 'Kem dưỡng ẩm', total: 450000, status: 'Hoàn thành', time: '5 phút trước' },
    { id: 2, orderId: 'NO-ORD002', customer: 'Phạm Thanh Mai', product: 'Son lì Nighty Red', total: 280000, status: 'Đang xử lý', time: '15 phút trước' },
    { id: 3, orderId: 'NO-ORD003', customer: 'Trần Minh Anh', product: 'Sữa rửa mặt', total: 180000, status: 'Đã hủy', time: '1 giờ trước' },
    { id: 4, orderId: 'NO-ORD004', customer: 'Lê Hoàng Yến', product: 'Mascara Volume Up', total: 320000, status: 'Hoàn thành', time: '2 giờ trước' },
    { id: 5, orderId: 'NO-ORD005', customer: 'Đỗ Hải Ly', product: 'Nước tẩy trang', total: 200000, status: 'Đang xử lý', time: '3 giờ trước' },
    { id: 6, orderId: 'NO-ORD006', customer: 'Vũ Quốc Bảo', product: 'Nước hoa Twilight Bloom', total: 650000, status: 'Hoàn thành', time: '4 giờ trước' },
    { id: 7, orderId: 'NO-ORD007', customer: 'Ngô Thùy Linh', product: 'Serum Vitamin C', total: 520000, status: 'Đang xử lý', time: '5 giờ trước' },
    { id: 8, orderId: 'NO-ORD008', customer: 'Dương Thị Hà', product: 'Chì kẻ mắt', total: 150000, status: 'Hoàn thành', time: '6 giờ trước' },
  ];

  // Hàm để render Chip trạng thái đơn hàng
  const renderOrderStatus = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'default';
    let icon: React.ReactElement;
    switch (status) {
      case 'Hoàn thành':
        color = 'success';
        icon = <CheckCircleIcon sx={{ fontSize: 16 }} />;
        break;
      case 'Đang xử lý':
        color = 'warning';
        icon = <PendingActionsIcon sx={{ fontSize: 16 }} />;
        break;
      case 'Đã hủy':
        color = 'error';
        icon = <CancelIcon sx={{ fontSize: 16 }} />;
        break;
      default:
        color = 'default';
        icon = <></>;
    }
    return <Chip label={status} color={color} size="small" icon={icon} variant="outlined" sx={{ fontWeight: 'bold' }} />;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Tổng Quan Dashboard Night Owls
          </Typography>
        </Slide>
        <Tooltip title="Làm mới dữ liệu">
          <IconButton onClick={handleRefresh} disabled={loading} color="primary" sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'rotate(90deg)' } }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2} key={index}> {/* Adjusted md size for 6 cards */}
            <Zoom in={!loading} style={{ transitionDelay: loading ? '0ms' : `${index * 120}ms` }}>
              <StatCard>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.2 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    {loading ? <CircularProgress size={20} sx={{ verticalAlign: 'middle' }} /> : stat.value}
                  </Typography>
                </Box>
              </StatCard>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section - Now with User Activity Chart */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={!loading} mountOnEnter unmountOnExit>
            <DashboardPaper>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium', color: theme.palette.text.primary }}>
                Biểu đồ Doanh thu 6 tháng gần nhất
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Bar data={chartData} options={chartOptions} />
                )}
              </Box>
            </DashboardPaper>
          </Slide>
        </Grid>

        {/* User Registration/Login Chart */}
        <Grid item xs={12} md={6}>
          <Slide direction="left" in={!loading} mountOnEnter unmountOnExit>
            <DashboardPaper>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium', color: theme.palette.text.primary }}>
                Hoạt động người dùng (Đăng ký & Đăng nhập)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Bar data={userActivityData} options={userActivityOptions} />
                )}
              </Box>
            </DashboardPaper>
          </Slide>
        </Grid>

        {/* Product Sales by Category Chart (formerly Product Chart) */}
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={!loading} mountOnEnter unmountOnExit>
            <DashboardPaper>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium', color: theme.palette.text.primary }}>
                Doanh thu theo danh mục sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, position: 'relative' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Pie data={productData} options={productOptions} />
                )}
              </Box>
            </DashboardPaper>
          </Slide>
        </Grid>

        {/* Recent Orders List - Detailed */}
        <Grid item xs={12} md={6}> {/* Changed to md=6 for a better 2-column layout */}
          <Slide direction="left" in={!loading} mountOnEnter unmountOnExit>
            <DashboardPaper sx={{ minHeight: 'auto' }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium', color: theme.palette.text.primary }}>
                Đơn hàng mới nhất
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 1, maxHeight: '300px' }}> {/* Increased maxHeight */}
                  {recentOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem
                        secondaryAction={renderOrderStatus(order.status)}
                        sx={{ py: 1.5, '&:hover': { backgroundColor: theme.palette.action.hover } }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                              {order.product}
                              <Box component="span" sx={{ ml: 1, fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                                (#{order.orderId})
                              </Box>
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              <Box component="span" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>{order.customer}</Box>
                              {' | '}
                              <Box component="span" sx={{ fontWeight: 'bold' }}>{order.total.toLocaleString('vi-VN')} VND</Box>
                              {' | '}
                              {order.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
              <AnimatedButton
                variant="text"
                color="primary"
                sx={{ mt: 2, alignSelf: 'flex-start' }}
              >
                Xem tất cả đơn hàng
              </AnimatedButton>
            </DashboardPaper>
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
}