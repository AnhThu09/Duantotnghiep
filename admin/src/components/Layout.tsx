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
  CircularProgress,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import StoreIcon from '@mui/icons-material/Store';
import ArticleIcon from '@mui/icons-material/Article';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RateReviewIcon from '@mui/icons-material/RateReview';
// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // Quản lý bài viết
// import ReviewsIcon from '@mui/icons-material/Reviews';           // Quản lý đánh giá
import { Link as RouterLink, useLocation } from 'react-router-dom';

// import Header from './Header'; // Import component Header đã tách riêng
// import { SignInPage } from '../pages/SignInPage';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading] = useState(false); // Luôn là false để ẩn kiểm tra đăng nhập/loading
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Quản lý danh mục', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Quản lý sản phẩm', icon: <ShoppingBagIcon />, path: '/products' },
    { text: 'Quản lý sản phẩm yêu thích', icon: <FavoriteIcon />, path: '/favorites' },
    { text: 'Quản lý người dùng', icon: <PeopleIcon />, path: '/users' },
    { text: 'Quản lý thương hiệu', icon: <StoreIcon />, path: '/brands' },
    { text: 'Quản lý mã giảm giá', icon: <LoyaltyIcon />, path: '/vouchers' },
    { text: 'Quản lý đơn hàng', icon: <ReceiptIcon />, path: '/orders' },
    { text: 'Quản lý bài viết', icon: <ArticleIcon />, path: '/posts' },
    { text: 'Quản lý đánh giá sản phẩm', icon: <RateReviewIcon />, path: '/reviews' },
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
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
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

<<<<<<< HEAD
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  if (authorized) {
    return <SignInPage onSignIn={onSignIn} />;
  }
=======
  // Ẩn kiểm tra đăng nhập/loading, luôn hiển thị layout
  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
  //       <CircularProgress size={48} thickness={4} />
  //     </Box>
  //   );
  // }
  // if (!authorized) {
  //   return <SignInPage onSignIn={onSignIn} />;
  // }
>>>>>>> 46df13841756a2d6566bd875c58dccb54aa00ad3

  return (
    <Box sx={{ display: 'flex' }}>
      <>
        {/* <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} /> */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="primary sidebar"
        >
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
          }}
        >
          {children}
        </Box>
      </>
    </Box>
  );
}
