// 📁 src/pages/FavoriteProductsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Snackbar, Paper, IconButton, Grid, Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext'; // Import useAuth

// --- INTERFACES ---
interface Product {
  product_id: number;
  favorite_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail: string;
  category_id: number;
  brand_id: number;
}

// --- CONFIG ---
const API_BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';

// --- COMPONENT FavoriteProductsPage ---
const FavoriteProductsPage: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const navigate = useNavigate(); // Hook để điều hướng
  const { currentUser } = useAuth(); // Lấy thông tin user từ AuthContext

  // ✅ Lấy user_id từ AuthContext thay vì hardcode
  const user_id = currentUser?.user_id;

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  const fetchFavoriteProducts = useCallback(async () => {
    if (!user_id) {
      showSnackbar('Vui lòng đăng nhập để xem danh sách yêu thích.', 'warning');
      setLoading(false);
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Gọi API để lấy sản phẩm yêu thích của người dùng
      const response = await axios.get(`${API_BASE_URL}/favorites/${user_id}`);
      setFavoriteProducts(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách yêu thích:', err);
      setError('Không thể tải danh sách sản phẩm yêu thích. Vui lòng thử lại.');
      showSnackbar('Lỗi khi tải danh sách yêu thích.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user_id, showSnackbar, navigate]);

  useEffect(() => {
    fetchFavoriteProducts();
  }, [fetchFavoriteProducts]);

   // ✅ SỬA HÀM handleRemoveFavorite để nhận favoriteId
const handleRemoveFavorite = async (product_id: number, favorite_id: number) => {
  if (!user_id) {
    showSnackbar('Bạn cần đăng nhập để thực hiện hành động này.', 'warning');
    navigate('/login');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    showSnackbar('Không có token xác thực.', 'error');
    return;
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/favorites/${product_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showSnackbar(response.data.message || '🗑️ Đã xóa sản phẩm khỏi danh sách yêu thích!', 'success');

    // ✅ Cập nhật UI ngay sau khi xóa
    setFavoriteProducts(prev =>
      prev.filter(product => product.product_id !== product_id)
    );

  } catch (error) {
    const msg =
      (error as any).response?.data?.message || '❌ Lỗi khi xóa sản phẩm khỏi danh sách yêu thích.';
    console.error('Lỗi xóa sản phẩm yêu thích:', error);
    showSnackbar(msg, 'error');

    if (
      (error as any).response &&
      ((error as any).response.status === 401 || (error as any).response.status === 403)
    ) {
      localStorage.removeItem('token');
    }
  }
};


  const handleAddToCart = async (product: Product) => {
    if (!user_id) {
      showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/cart`, {
        user_id,
        product_id: product.product_id,
        quantity: 1
      });
      showSnackbar(response.data.message || '✅ Đã thêm sản phẩm vào giỏ hàng!', 'success');
    } catch (error) {
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || '❌ Thêm vào giỏ hàng thất bại.';
      console.error("Lỗi thêm vào giỏ hàng từ trang yêu thích:", error);
      showSnackbar(msg, 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải danh sách yêu thích...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchFavoriteProducts}>Thử lại</Button>
      </Box>
    );
  }

  if (!user_id) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="warning.main">Bạn cần đăng nhập để xem danh sách yêu thích.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/login')}>Đăng nhập ngay</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Sản phẩm yêu thích của bạn
      </Typography>

      {favoriteProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h6" color="text.secondary">Bạn chưa có sản phẩm yêu thích nào.</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Hãy duyệt qua các sản phẩm của chúng tôi và thêm những thứ bạn thích vào đây!
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} component={Link} to="/">
            Khám phá sản phẩm ngay
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoriteProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.product_id}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '8px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                  '&:hover': {
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                  },
                  transition: 'box-shadow 0.2s ease-in-out',
                  backgroundColor: '#fff',
                  position: 'relative', // Để position các nút
                }}
              >
                {/* Nút xóa */}
                <IconButton
                  aria-label="xóa khỏi yêu thích"
                  sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
              onClick={() => handleRemoveFavorite(product.product_id)} 

                >
                  <FavoriteIcon sx={{ color: "#212121" }} fontSize="small" />
                </IconButton>

                <Link
                  to={`/products/${product.product_id}`} // Điều hướng đến trang chi tiết
                  style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }} // Đảm bảo Link bao bọc phần tử
                >
                  <Box sx={{ width: '100%', height: '200px', overflow: 'hidden', mb: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
                      alt={product.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
                    />
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'start',
                      mb: 1,
                      fontSize: '1.1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6em',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', fontSize: '1.0rem', textAlign: 'start' }}>
                    {Number(product.price).toLocaleString('vi-VN')}₫
                  </Typography>
                </Link>

                {/* Nút thêm vào giỏ hàng (không bị Link bao bọc) */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartOutlinedIcon />}
                    sx={{ width: '100%' }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FavoriteProductsPage;
