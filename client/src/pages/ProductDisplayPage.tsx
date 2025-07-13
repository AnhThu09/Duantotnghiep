// 📁 src/components/ProductDisplayPage.tsx (Đã sửa lỗi TypeScript 2345)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Paper, useTheme, CircularProgress, Snackbar, Alert, IconButton
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Icon trái tim tô đậm (đã yêu thích)
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
  onToggleFavorite: (e: React.MouseEvent, product: Product, isCurrentlyFavorite: boolean) => void;
  isFavorite: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
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
        cursor: 'pointer',
      }}
    >
      <Box sx={{ width: '100%', height: '250px', overflow: 'hidden', mb: 1.2}}>
        <img
          src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
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
          fontSize: '1.1rem',
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
          <IconButton
            size="small"
            sx={{ color: isFavorite ? 'black' : '#333' }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(e, product, isFavorite);
            }}
          >
            {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: '#333', width: 30, height: 30 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(e, product);
            }}
          >
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
  const { currentUser } = useAuth();
  const user_id = currentUser?.user_id;
  const navigate = useNavigate();

  const [userFavorites, setUserFavorites] = useState<Set<number>>(new Set());

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleSnackbarClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }, []);

  const fetchUserFavorites = useCallback(async () => {
    if (!user_id) {
      setUserFavorites(new Set());
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites/${user_id}`);
      const favoriteProductIds = new Set<number>(response.data.map((fav: Product) => fav.product_id)); // ✅ Sửa lỗi ở đây
      setUserFavorites(favoriteProductIds);
    } catch (err) {
      console.error("Lỗi khi tải danh sách yêu thích của người dùng:", err);
    }
  }, [user_id]);

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
      await fetchUserFavorites();
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
      console.error("Lỗi khi tải sản phẩm bán chạy:", err);
      showSnackbar('Lỗi khi tải sản phẩm. Vui lòng kiểm tra console.', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchUserFavorites, showSnackbar]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!user_id) {
      setTimeout(() => navigate('/login'), 1000);
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
      console.error("Lỗi thêm vào giỏ hàng:", error);
      showSnackbar(msg, 'error');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, product: Product, isCurrentlyFavorite: boolean) => {
    e.stopPropagation();
    if (!user_id) {
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    try {
      if (isCurrentlyFavorite) {
        const response = await axios.delete(`${API_BASE_URL}/favorites/${user_id}/${product.product_id}`);
        showSnackbar(response.data.message || `🗑️ Đã xóa '${product.name}' khỏi danh sách yêu thích!`, 'info');
        setUserFavorites(prev => {
          const newSet = new Set<number>(prev); // ✅ Sửa lỗi ở đây
          newSet.delete(product.product_id);
          return newSet;
        });
      } else {
        const response = await axios.post(`${API_BASE_URL}/favorites`, {
          user_id: user_id,
          product_id: product.product_id
        });
        showSnackbar(response.data.message || `✅ Đã thêm '${product.name}' vào danh sách yêu thích!`, 'success');
        setUserFavorites(prev => {
          const newSet = new Set<number>(prev); // ✅ Sửa lỗi ở đây
          newSet.add(product.product_id);
          return newSet;
        });
      }
    } catch (error) {
      const msg = (error as any).response?.data?.message || 'Lỗi khi cập nhật danh sách yêu thích.';
      console.error("Lỗi cập nhật yêu thích:", error);
      if ((error as any).response?.status === 409) {
        showSnackbar(msg, 'info');
        setUserFavorites(prev => {
          const newSet = new Set<number>(prev); // ✅ Sửa lỗi ở đây
          newSet.add(product.product_id);
          return newSet;
        });
      } else {
        showSnackbar(msg, 'error');
      }
    }
  };

  const displayedProducts = useMemo(() => {
    return products.slice(0, 8);
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
        SẢN PHẨM BÁN CHẠY
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
        }}
      >
        {displayedProducts.map((product) => (
          <Link
            key={product.product_id}
            to={`/products/${product.product_id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={userFavorites.has(product.product_id)}
            />
          </Link>
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
