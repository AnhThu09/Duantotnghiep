// 📁 src/pages/ProductDetailPage.tsx (Thiết kế lại hiện đại, không thêm section)

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Rating,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductReview from './ProductReview';

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
  rating?: number;
  reviews?: number;
  brand_name?: string;
}

const API_BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  const { currentUser } = useAuth();
  const user_id = currentUser?.user_id; // Giả định user_id
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const handleSnackbarClose = useCallback(
    (_event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') return;
      setSnackbarOpen(false);
    },
    []
  );

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      const data = response.data;
      data.rating = data.rating || 0;
      data.reviews = data.reviews || 0; 
      data.images = data.images?.length ? data.images : Array(5).fill(data.thumbnail);
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại.');
      showSnackbar('Lỗi khi tải chi tiết sản phẩm.', 'error');
    } finally {
      setLoading(false);
    }
  }, [productId, showSnackbar]);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId, fetchProductDetails]);

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
        quantity,
      });
      showSnackbar(response.data.message || '✅ Đã thêm sản phẩm vào giỏ hàng!', 'success');
    } catch (error) {
      const msg = (error as any).response?.data?.message || '❌ Thêm vào giỏ hàng thất bại.';
      console.error('Lỗi thêm vào giỏ hàng:', error);
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
        user_id,
        product_id: product.product_id,
      });
      showSnackbar(
        response.data.message || `✅ Đã thêm '${product.name}' vào danh sách yêu thích!`,
        'success'
      );
    } catch (error) {
      const msg =
        (error as any).response?.data?.message || '❌ Thêm vào danh sách yêu thích thất bại.';
      showSnackbar(msg, (error as any).response?.status === 409 ? 'info' : 'error');
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải chi tiết sản phẩm...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error || 'Không tìm thấy sản phẩm này.'}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchProductDetails}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3, mt:14 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>
            Trang chủ
          </Link>
          {' / '}
          <Link to="/products" style={{ color: '#888', textDecoration: 'none' }}>
            Sản phẩm
          </Link>
          {' / '}
          <span style={{ color: '#d81b60', fontWeight: 600 }}>{product.name}</span>
        </Typography>
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        <Box flex={1}>
          <img
            src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
            alt={product.name}
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </Box>

        <Box flex={1}>
          {product.brand_name && (
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              {product.brand_name}
            </Typography>
          )}
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
           <Rating value={product.rating || 0} readOnly precision={0.1} />
<Typography variant="body2" color="text.secondary">
  {product.rating?.toFixed(1) || 0} ({product.reviews || 0} đánh giá)
</Typography>

          </Box>

          <Typography variant="h5" fontWeight={700} color="error" mb={2}>
            {(product.price * quantity).toLocaleString('vi-VN')}₫
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Box display="flex" alignItems="center" mt={2} mb={3}>
            <Button variant="outlined" size="small" onClick={() => handleQuantityChange(-1)}>
              -
            </Button>
            <Typography variant="h6" mx={2}>
              {quantity}
            </Typography>
            <Button variant="outlined" size="small" onClick={() => handleQuantityChange(1)}>
              +
            </Button>
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ minWidth: 250 }}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="outlined"
              startIcon={<FavoriteBorderIcon />}
              onClick={handleAddToFavorites}
            >
              Yêu thích
            </Button>
          </Box>

          <Button variant="contained" color="secondary" fullWidth sx={{ mb: 3, fontWeight: 600 }}>
            Mua ngay
          </Button>

          <Box mt={2} color="text.secondary">
            <Typography>🚚 Giao hàng nhanh</Typography>
            <Typography>✅ Hàng chính hãng</Typography>
            <Typography>↩️ Đổi trả dễ dàng</Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={5}>
        <Tabs value={tab} onChange={(_e, newVal) => setTab(newVal)}>
          <Tab label="Mô tả sản phẩm" />
  <Tab label={`Đánh giá (${product.reviews || 0})`} />

        </Tabs>
        <Divider sx={{ mb: 2 }} />
        <Box>
          {tab === 0 && (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>
            
          )}
{tab === 1 && <ProductReview productId={product.product_id} />}
        </Box>
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
