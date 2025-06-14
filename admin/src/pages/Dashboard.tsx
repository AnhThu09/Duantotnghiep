import React from 'react';
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
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StorageIcon from '@mui/icons-material/Storage';

// Imports và Đăng ký cho Chart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const theme = useTheme();

  const stats = [
    { title: 'Tổng Người dùng', value: '1,234', icon: <PeopleIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} /> },
    { title: 'Đơn hàng mới', value: '56', icon: <ShoppingCartIcon sx={{ fontSize: 30, color: theme.palette.success.main }} /> },
    { title: 'Doanh thu hôm nay', value: '15.000.000 VND', icon: <MonetizationOnIcon sx={{ fontSize: 30, color: theme.palette.warning.main }} /> },
    { title: 'Sản phẩm tồn kho', value: '250', icon: <StorageIcon sx={{ fontSize: 30, color: theme.palette.info.main }} /> },
  ];

  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [65, 59, 80, 81, 56, 70],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      title: {
        display: false,
        text: 'Biểu đồ Doanh thu',
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        bodyColor: '#fff',
        titleColor: '#fff',
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: { color: theme.palette.text.secondary },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.dark }}>
        Tổng Quan Dashboard
      </Typography>

      {/* Dòng các thẻ thống kê nhanh (trên cùng) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                height: '100%',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{stat.icon}</Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.2 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dòng chứa Biểu đồ Doanh thu và Đơn hàng mới nhất */}
      <Grid container spacing={3}>
        {/* Biểu đồ Doanh thu */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: { xs: '300px', sm: '350px', md: '400px' },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
              Biểu đồ Doanh thu 6 tháng gần nhất
            </Typography>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Bảng đơn hàng mới nhất */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: { xs: '300px', sm: '350px', md: '400px' },
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
              Đơn hàng mới nhất
            </Typography>
            <List dense sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH001 - John Doe" secondary="1.200.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH002 - Jane Smith" secondary="850.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH003 - Bob Johnson" secondary="2.500.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH004 - Alice Brown" secondary="500.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH005 - Michael Green" secondary="1.800.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH006 - Emily White" secondary="900.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH007 - David Lee" secondary="750.000 VND" />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ py: 0.5 }}>
                <ListItemText primary="#DH008 - Sarah Kim" secondary="1.100.000 VND" />
              </ListItem>
            </List>
            <Button
              variant="text"
              color="primary"
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              Xem tất cả đơn hàng
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}