import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';

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

// Styled Components
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
  minHeight: '350px',
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

// Kiểu dữ liệu
interface StatItem {
  title: string;
  value: string;
  icon: React.ReactElement;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
    borderRadius?: number;
  }[];
}

interface OrderItem {
  id: number;
  orderId: string;
  customer: string;
  product: string;
  total: number;
  status: string;
  time: string;
}

// Cấu hình Base URL của API
const API_BASE_URL = 'http://localhost:3000/api/dashboard';

export default function Dashboard() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // State lưu trữ dữ liệu từ API
  const [stats, setStats] = useState<StatItem[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [productCategorySalesData, setProductCategorySalesData] = useState<ChartData>({ labels: [], datasets: [] });
  const [userActivityChartData, setUserActivityChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch tất cả dữ liệu dashboard
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Stats
      const statsRes = await fetch(`${API_BASE_URL}/stats`);
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsRes.json();
      setStats([
        { title: 'Tổng Người dùng', value: statsData.totalUsers.toLocaleString(), icon: <PeopleIcon sx={{ fontSize: 35, color: theme.palette.primary.main }} /> },
        { title: 'Đăng ký mới (tháng này)', value: statsData.newRegistrationsThisMonth.toLocaleString(), icon: <PersonAddAlt1Icon sx={{ fontSize: 35, color: theme.palette.info.main }} /> },
        { title: 'Người dùng hoạt động (hôm nay)', value: statsData.activeUsersToday.toLocaleString(), icon: <HowToRegIcon sx={{ fontSize: 35, color: theme.palette.secondary.main }} /> },
        { title: 'Đơn hàng mới (hôm nay)', value: statsData.newOrdersToday.toLocaleString(), icon: <ShoppingCartIcon sx={{ fontSize: 35, color: theme.palette.success.main }} /> },
        { title: 'Doanh thu hôm nay', value: statsData.revenueToday.toLocaleString('vi-VN') + ' VND', icon: <MonetizationOnIcon sx={{ fontSize: 35, color: theme.palette.warning.main }} /> },
        { title: 'Sản phẩm tồn kho', value: statsData.stockProducts.toLocaleString(), icon: <Inventory2Icon sx={{ fontSize: 35, color: theme.palette.error.main }} /> },
      ]);

      // Revenue Chart
      const revenueRes = await fetch(`${API_BASE_URL}/revenue-by-month`);
      if (!revenueRes.ok) throw new Error('Failed to fetch revenue chart data');
      const revenueData = await revenueRes.json();
      setRevenueChartData({
        labels: revenueData.labels,
        datasets: [{
          label: 'Doanh thu (VND)',
          data: revenueData.data,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.dark,
          borderWidth: 1,
          borderRadius: 4,
        }],
      });

      // Product Sales by Category
      const productSalesRes = await fetch(`${API_BASE_URL}/sales-by-category`);
      if (!productSalesRes.ok) throw new Error('Failed to fetch product sales data');
      const productSalesData = await productSalesRes.json();
      setProductCategorySalesData({
        labels: productSalesData.labels,
        datasets: [{
          label: 'Doanh thu theo danh mục (VND)',
          data: productSalesData.data,
          backgroundColor: [
            theme.palette.info.light,
            theme.palette.success.light,
            theme.palette.warning.light,
            theme.palette.secondary.light,
            theme.palette.primary.light,
          ],
          borderColor: [
            theme.palette.info.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.secondary.main,
            theme.palette.primary.main,
          ],
          borderWidth: 1,
        }],
      });

      // User Activity
      const userActivityRes = await fetch(`${API_BASE_URL}/user-activity`);
      if (!userActivityRes.ok) throw new Error('Failed to fetch user activity data');
      const userActivityData = await userActivityRes.json();
      setUserActivityChartData({
        labels: userActivityData.labels,
        datasets: [
          {
            label: 'Người dùng đăng ký mới',
            data: userActivityData.newRegistrations,
            backgroundColor: theme.palette.success.main,
            borderColor: theme.palette.success.dark,
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Người dùng đăng nhập',
            data: userActivityData.logins,
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      });

      // Recent Orders
      const ordersRes = await fetch(`${API_BASE_URL}/recent-orders`);
      if (!ordersRes.ok) throw new Error('Failed to fetch recent orders');
      const ordersData = await ordersRes.json();
      setRecentOrders(ordersData);

    } catch (err: unknown) {
      let errorMessage = 'Không thể tải dữ liệu dashboard. Vui lòng thử lại.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setStats([]);
      setRevenueChartData({ labels: [], datasets: [] });
      setProductCategorySalesData({ labels: [], datasets: [] });
      setUserActivityChartData({ labels: [], datasets: [] });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  }, [theme]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Chart Options
  const userActivityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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
          label: function (context: import('chart.js').TooltipItem<'bar'>) {
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
        position: 'top' as const,
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
          label: function (context: import('chart.js').TooltipItem<'bar'>) {
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
          callback: function (value: any) {
            return (value as number / 1000000).toFixed(0) + ' Tr VND';
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
        position: 'right' as const,
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
          label: function (context: import('chart.js').TooltipItem<'pie'>) {
            let label = context.label || '';
            if (label) { label += ': '; }
            if (context.parsed !== null) {
              const dataset = context.dataset;
              const total = dataset.data.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
              const currentValue = dataset.data[context.dataIndex] as number;
              const percentage = ((currentValue / total) * 100).toFixed(1);
              label = label + currentValue.toLocaleString('vi-VN') + ' VND (' + percentage + '%)';
            }
            return label;
          },
        },
      },
    },
  };

  // Render Chip trạng thái đơn hàng
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

      {error && (
        <Box sx={{ mb: 4, p: 2, backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText, borderRadius: 1 }}>
          <Typography variant="body1">Lỗi: {error}</Typography>
        </Box>
      )}

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 35, height: 35, mr: 2 }}>
                  <CircularProgress size={20} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.2 }}>Đang tải...</Typography>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                    <CircularProgress size={20} sx={{ verticalAlign: 'middle' }} />
                  </Typography>
                </Box>
              </StatCard>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Zoom in={true} style={{ transitionDelay: `${index * 120}ms` }}>
                <StatCard>
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.2 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </StatCard>
              </Zoom>
            </Grid>
          ))
        )}
      </Grid>

      {/* Charts Section */}
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
                  revenueChartData.labels.length > 0 ? (
                    <Bar data={revenueChartData} options={chartOptions} />
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                      Không có dữ liệu doanh thu.
                    </Typography>
                  )
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
                  userActivityChartData.labels.length > 0 ? (
                    <Bar data={userActivityChartData} options={userActivityOptions} />
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                      Không có dữ liệu hoạt động người dùng.
                    </Typography>
                  )
                )}
              </Box>
            </DashboardPaper>
          </Slide>
        </Grid>

        {/* Product Sales by Category Chart */}
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={!loading} mountOnEnter unmountOnExit>
            <DashboardPaper>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium', color: theme.palette.text.primary }}>
                Doanh thu theo danh mục sản phẩm
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  productCategorySalesData.labels.length > 0 ? (
                    <Pie data={productCategorySalesData} options={productOptions} />
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                      Không có dữ liệu doanh thu theo danh mục.
                    </Typography>
                  )
                )}
              </Box>
            </DashboardPaper>
          </Slide>
        </Grid>

        {/* Recent Orders List */}
        <Grid item xs={12} md={6}>
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
                recentOrders.length > 0 ? (
                  <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 1, maxHeight: '300px' }}>
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
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    Không có đơn hàng mới nào.
                  </Typography>
                )
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