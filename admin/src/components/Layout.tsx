import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import StoreIcon from '@mui/icons-material/Store';
import ArticleIcon from '@mui/icons-material/Article';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // Quản lý bài viết
import ReviewsIcon from '@mui/icons-material/Reviews';           // Quản lý đánh giá

import { Link as RouterLink } from 'react-router-dom';

import Header from './Header'; // Import component Header đã tách riêng
// import { SignInPage } from '../pages/SignInPage'; // KHÔNG CẦN DÒNG NÀY NỮA

const drawerWidth = 240; // Chiều rộng cố định của Sidebar

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false); // State quản lý Sidebar trên di động

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Quản lý Danh mục', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Quản lý Sản phẩm', icon: <ShoppingBagIcon />, path: '/products' },
    { text: 'Quản lý Sản phẩm Yêu thích', icon: <FavoriteIcon />, path: '/favorite-products' }, // Đã sửa path
    { text: 'Quản lý Người dùng', icon: <PeopleIcon />, path: '/users' },

    { text: 'Quản lý Thương hiệu', icon: <StoreIcon />, path: '/brands' },
    { text: 'Quản lý Mã giảm giá', icon: <LoyaltyIcon />, path: '/discount-codes' }, // Đã sửa path
    { text: 'Quản lý Đơn hàng', icon: <ReceiptIcon />, path: '/orders' },
      { text: 'Quản lý Bài viết', icon: <ArticleIcon />, path: '/posts' },
    { text: 'Quản lý Đánh giá', icon: <RateReviewIcon />, path: '/reviews' },
    { text: 'Quản lý Đánh giá sản phẩm', icon: <RateReviewIcon />, path: '/reviews' },
    // Các dòng bị lặp hoặc sai icon/path dưới đây đã được loại bỏ/sửa theo logic của bạn

    { text: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Night Owls
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { /* Xử lý đăng xuất */ }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Khối JSX chính bao gồm Header, Sidebar và Content */}
      <>
        {/* Header */}
        <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />

        {/* Sidebar Navigation */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="primary sidebar"
        >
          {/* Sidebar cho màn hình di động (temporary) */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          {/* Sidebar cho màn hình máy tính (permanent) */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Khu vực nội dung chính */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '64px', // Margin top để tránh Header che khuất nội dung
          }}
        >
          {children} {/* Nội dung của các trang con (Dashboard, CategoryManager) sẽ hiển thị ở đây */}
        </Box>
      </>
    </Box>
  );
}