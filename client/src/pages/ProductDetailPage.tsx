// 📁 src/pages/ProductDetailPage.tsx (Đã sửa lỗi TypeScript)

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Snackbar, Button, Paper, Divider
} from '@mui/material';
// ✅ Đã xóa IconButton khỏi import vì không dùng đến trong component này
// import IconButton from '@mui/material'; // Dòng này bị xóa hoặc điều chỉnh
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- INTERFACES ---
interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail: string;
  category_id: number;
  brand_id: number;
  images?: string[];
}

// --- CONFIG ---
const API_BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';

// --- COMPONENT ProductDetailPage ---
const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const { currentUser } = useAuth();
  const user_id = currentUser?.user_id; // Giả định user_id
  const navigate = useNavigate();

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  // ✅ Đưa fetchProductDetails ra ngoài useEffect và bọc trong useCallback
  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại.');
      showSnackbar('Lỗi khi tải chi tiết sản phẩm.', 'error');
    } finally {
      setLoading(false);
    }
  }, [productId, showSnackbar]); // Thêm dependencies cho useCallback

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId, fetchProductDetails]); // Thêm fetchProductDetails vào dependency array

  const handleAddToCart = async () => {
    if (!user_id) {
      showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!product) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/cart`, {
        user_id,
        product_id: product.product_id,
        quantity: 1
      });
      showSnackbar(response.data.message || '✅ Đã thêm sản phẩm vào giỏ hàng!', 'success');
    } catch (error) {
      const msg = (error as any).response?.data?.message || '❌ Thêm vào giỏ hàng thất bại.';
      console.error("Lỗi thêm vào giỏ hàng từ trang chi tiết:", error);
      showSnackbar(msg, 'error');
    }
  };

  const handleAddToFavorites = async () => {
    if (!user_id) {
      showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!product) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        user_id: user_id,
        product_id: product.product_id
      });
      showSnackbar(response.data.message || `✅ Đã thêm '${product.name}' vào danh sách yêu thích!`, 'success');
    } catch (error) {
      const msg = (error as any).response?.data?.message || '❌ Thêm vào danh sách yêu thích thất bại.';
      console.error("Lỗi khi thêm vào danh sách yêu thích:", error);
      if ((error as any).response?.status === 409) {
        showSnackbar(msg, 'info');
      } else {
        showSnackbar(msg, 'error');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải chi tiết sản phẩm...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
        {/* ✅ Gọi fetchProductDetails đã được khai báo bên ngoài */}
        <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchProductDetails}>Thử lại</Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6">Không tìm thấy sản phẩm này.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, borderRadius: '8px' }}>
        {/* Left Section: Product Image */}
        <Box sx={{
          flex: '1 1 50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: { xs: '300px', md: '500px' },
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 5px rgba(0,0,0,0.08)'
        }}>
          <img
            src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
          />
        </Box>

        {/* Right Section: Product Details */}
        <Box sx={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mr: 2 }}>
              {Number(product.price).toLocaleString('vi-VN')}₫
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#555' }}>
            {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              sx={{ flex: 1, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FavoriteBorderIcon />}
              sx={{ py: 1.5, fontSize: '1rem' }}
              onClick={handleAddToFavorites}
            >
              Yêu thích
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Có thể thêm phần mô tả chi tiết hơn hoặc các sản phẩm liên quan ở đây */}
      <Box sx={{ mt: 4, p: { xs: 2, sm: 3, md: 4 }, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Mô tả chi tiết</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {product.description || 'Hiện tại không có mô tả chi tiết bổ sung.'}
        </Typography>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;
