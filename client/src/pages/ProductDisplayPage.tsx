import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Paper, useTheme, CircularProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';

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
  rating?: number;
  reviews?: number;
  label?: 'BESTSELLER' | 'WORTH';
  labelValue?: string;
}

// --- CONFIG ---
const API_BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';

// --- COMPONENT ProductCard ---
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToFavorites: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToFavorites }) => {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
        '&:hover': {
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        },
        transition: 'box-shadow 0.2s ease-in-out',
        backgroundColor: '#fff',
        textAlign: 'center',
      }}
    >
      <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', mb: 1.2}}>
  <img
    src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
    alt={product.name}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover', // ✅ ảnh phủ toàn bộ khung
      display: 'block'
    }}
    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/240x240?text=No+Image'; }}
  />
</Box>


      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold',
          textAlign: 'start',
          mb: 2,
          fontSize: '1.5 rem',
          lineHeight: '1.3',
          minHeight: '2.6em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {product.name}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', fontSize: '1.1rem' }}>
          {Number(product.price).toLocaleString('vi-VN')}₫
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" sx={{ color: '#333' }} onClick={() => onAddToFavorites(product)}>
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#333', width: 30, height: 30 }} onClick={() => onAddToCart(product)}>
            <ShoppingCartOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

// --- MAIN COMPONENT ---
export default function ProductDisplayPage() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  const user_id = 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const apiProducts = response.data.map((p: Product) => ({
        ...p,
        rating: p.rating ?? (Math.random() * (5 - 3) + 3),
        reviews: p.reviews ?? Math.floor(Math.random() * 200) + 50,
      }));
      setProducts(apiProducts);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
      showSnackbar('Lỗi khi tải sản phẩm. Vui lòng kiểm tra console.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user_id) {
      showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
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
      const msg = (error as any).response?.data?.message || '❌ Thêm vào giỏ hàng thất bại.';
      showSnackbar(msg, 'error');
    }
  };

  const handleAddToFavorites = (product: Product) => {
    if (!user_id) {
      showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!', 'error');
      return;
    }
    showSnackbar(`✅ Đã thêm '${product.name}' vào danh sách yêu thích!`, 'info');
  };

  const displayedProducts = useMemo(() => {
    return products.slice(0, 8); // ✅ Giới hạn 4 sản phẩm
  }, [products]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải sản phẩm...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Sản phẩm bán chạy
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)' // ✅ 4 sản phẩm / hàng
          },
          gap: 3,
        }}
      >
        {displayedProducts.map((product) => (
          <Box key={product.product_id}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
            />
          </Box>
        ))}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
