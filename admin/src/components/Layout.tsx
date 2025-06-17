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
  Typography, // Vẫn cần Typography cho tiêu đề "Admin Panel"
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink } from 'react-router-dom';

import Header from './Header'; // Import component Header đã tách riêng
import { LocalOffer } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';


const drawerWidth = 240; // Chiều rộng cố định của Sidebar

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false); // State quản lý Sidebar trên di động

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Danh sách các mục trong Sidebar
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Quản lý Danh mục', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Quản lý Sản phẩm', icon: <ShoppingBagIcon />, path: '/products' },
    { text: 'Sản phẩm Yêu thích', icon: <FavoriteIcon />, path: '/favorites' },
    { text: 'Quản lý Người dùng', icon: <PeopleIcon />, path: '/users' },
    { text: 'Quản lý Thương hiệu', icon: <LocalOffer />, path: '/brands' },
    { text: 'Quản lý Voucher', icon: <LocalOffer />, path: '/vouchers' },
    { text: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Nội dung của Sidebar (dùng chung cho cả mobile và desktop)
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
          <ListItemButton>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sử dụng component Header mới */}
      <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />

      {/* Vùng Sidebar Navigation */}
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
    </Box>
  );
}