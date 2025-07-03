import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, Grid, Rating,
  TextField, InputAdornment, useTheme, CircularProgress, Snackbar, Alert, IconButton
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

// --- URL HÌNH ẢNH (BẠN CẦN THAY THẾ BẰNG ĐƯỜNG DẪN ĐẾN ẢNH THẬT CỦA BẠN) ---
const IMG_LARGE_SHAMPOO_DISPLAY = 'https://www.thebodyshop.com/cdn/shop/files/1042553_1042550_1042574_GINGER_RANGE_ROUTINE_SILVER_INAHMPS066_0626cc47-ae54-4bb6-a988-be15b1fd107a.jpg?v=1737370535&width=1512';

// --- COMPONENT ProductCard (Một thẻ sản phẩm) ---
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
        height: '100%',
        minHeight: '420px', // Đặt chiều cao tối thiểu cố định cho mỗi thẻ sản phẩm
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
        '&:hover': {
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        },
        transition: 'box-shadow 0.2s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
        textAlign: 'center',
      }}
    >
      {/* Phần ảnh sản phẩm - Đặt chiều cao cố định để ảnh chiếm không gian nhất quán */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, height: '250px' }}>
        {product.thumbnail ? (
          <img
            src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/180x250?text=No+Image'; }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">No Image</Typography>
        )}
      </Box>

      {/* Tên sản phẩm - Điều chỉnh fontSize để phù hợp */}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold', textAlign: 'center', mb: 0.5,
          fontSize: '1.1rem',
          lineHeight: '1.2', flexGrow: 1,
          minHeight: '2.4em',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}
      >
        {product.name}
      </Typography>

      {/* Giá, Yêu thích và Giỏ hàng - Điều chỉnh fontSize để phù hợp */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', fontSize: '1.2rem' }}>
          {Number(product.price).toLocaleString('vi-VN')}₫
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: '#333' }} onClick={() => onAddToFavorites(product)}>
                <FavoriteBorderIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{
                color: '#333',
                width: 30, height: 30,
                '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                }
            }} onClick={() => onAddToCart(product)}>
                <ShoppingCartOutlinedIcon fontSize="small" />
            </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

// --- MAIN COMPONENT ProductDisplayPage ---
export default function ProductDisplayPage() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  const user_id = 1; // Assuming user_id is available

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      const apiProducts = response.data.map((p: Product) => {
        const productWithDetails: Product = {
          ...p,
          rating: p.rating !== undefined ? p.rating : (Math.random() * (5 - 3) + 3),
          reviews: p.reviews !== undefined ? p.reviews : Math.floor(Math.random() * 200) + 50,
        };
        return productWithDetails;
      });
      setProducts(apiProducts);
    } catch (err) {
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
      console.error('Fetch products error:', err);
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
        showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'warning');
        return;
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/cart`, {
            user_id: user_id,
            product_id: product.product_id,
            quantity: 1
        });
        showSnackbar(response.data.message || '✅ Đã thêm sản phẩm vào giỏ hàng!', 'success');
        console.log('Phản hồi từ server:', response.data);
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        const errorMessage = (error as any).response?.data?.message || '❌ Thêm vào giỏ hàng thất bại. Vui lòng thử lại.';
        showSnackbar(errorMessage, 'error');
    }
  };

  const handleAddToFavorites = (product: Product) => {
      if (!user_id) {
          showSnackbar('❌ Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!', 'warning');
          return;
      }
      showSnackbar(`✅ Đã thêm '${product.name}' vào danh sách yêu thích! (Chức năng chưa được triển khai hoàn chỉnh)`, 'info');
      console.log(`User ${user_id} added ${product.name} to favorites.`);
  };

  const displayedProducts = useMemo(() => {
    // Hiển thị 6 sản phẩm
    return products.slice(0, 6);
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

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: 'center' }}>
        Sản phẩm bán chạy
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 4, // khoảng cách giữa 2 cột
          flexDirection: { xs: 'column', md: 'row' }, // Dọc trên mobile, ngang trên desktop
          alignItems: 'stretch', // Giúp các cột cao bằng nhau
        }}
      >
        {/* Cột trái: Hiển thị sản phẩm */}
        {/* Đã điều chỉnh flex để cột này chiếm nhiều không gian hơn */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}> {/* Thay đổi flex từ 1 thành 2 */}
              <Grid container spacing={2} justifyContent="flex-start">
                {displayedProducts.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                      Không tìm thấy sản phẩm nào.
                    </Typography>
                  </Grid>
                ) : (
                  displayedProducts.map((product) => (
                    // Điều chỉnh Grid item để tối ưu cho kích thước thẻ mới
                    // md={4} hoặc lg={4} sẽ cho 3 sản phẩm/hàng trên màn hình desktop
                    <Grid item xs={12} sm={6} md={4} lg={4} key={product.product_id}>
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToFavorites={handleAddToFavorites}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
          </Box>

        {/* Cột phải: Hình ảnh lớn */}
        {/* Đã điều chỉnh flex để cột này chiếm ít không gian hơn */}
        <Box sx={{ flex: { xs: 1, md: 1 } }}> {/* Giữ nguyên flex 1 */}
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  height: '100%',
                  minHeight: { xs: 300, md: 'auto' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={IMG_LARGE_SHAMPOO_DISPLAY}
                  alt="Large product display image"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Large+Image'; }}
                />
              </Box>
            </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}