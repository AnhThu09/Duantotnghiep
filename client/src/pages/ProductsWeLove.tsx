import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Typography, Paper, IconButton, Snackbar, Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
interface Category {
  category_id: number;
  category_name: string;
  slug: string;
}

interface Product {
  product_id: number;
  name: string;
  thumbnail: string;
  price: number;
}

const BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';
const TABS_TO_DISPLAY = ['serum', 'kem-duong-am', 'cham-soc-da'];

export default function ProductByCategoryScroll() {
  const { slug: urlSlug } = useParams();
  const navigate = useNavigate();
  // const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('serum');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [favorites, setFavorites] = useState<Set<number>>(new Set()); // ✅ Set để tra cứu nhanh

  const { currentUser } = useAuth();
  const user_id = currentUser?.user_id;

  // ✅ Lấy danh mục
  useEffect(() => {
    axios.get(`${BASE_URL}/categories`)
      .then(res => {
        const filtered = res.data.filter((cat: Category) => TABS_TO_DISPLAY.includes(cat.slug));
        setCategories(filtered);
      });
  }, []);

  // ✅ Lấy sản phẩm + danh sách yêu thích ban đầu
  const fetchData = useCallback(async (slug: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/products/category/${slug}`);
      setProducts(res.data);

      // Gọi luôn danh sách yêu thích
      if (user_id) {
        const favRes = await axios.get(`${BASE_URL}/favorites/${user_id}`);
        const favSet = new Set(favRes.data.map((item: Product) => item.product_id));
        setFavorites(favSet);
      } else {
        setFavorites(new Set());
      }
    } catch (err) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    const slugToUse = urlSlug || 'serum';
    setActiveCategorySlug(slugToUse);
    fetchData(slugToUse);
  }, [urlSlug, fetchData]);

  const fetchProductsByTab = (tabSlug: string) => {
    setActiveCategorySlug(tabSlug);
    fetchData(tabSlug);
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user_id) {
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/cart`, {
        user_id,
        product_id: product.product_id,
        quantity: 1
      });
      setAlert({ open: true, message: res.data.message, severity: 'success' });
    } catch {
      setAlert({ open: true, message: '❌ Thêm vào giỏ hàng thất bại.', severity: 'error' });
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, product: Product, isCurrentlyFavorite: boolean) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user_id) {
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    const newSet = new Set(favorites);
    if (isCurrentlyFavorite) {
      newSet.delete(product.product_id);
    } else {
      newSet.add(product.product_id);
    }
    setFavorites(newSet); // Cập nhật UI ngay

    try {
      if (isCurrentlyFavorite) {
        await axios.delete(`${BASE_URL}/favorites/${user_id}/${product.product_id}`);
        setAlert({ open: true, message: `Đã xóa '${product.name}' khỏi yêu thích!`, severity: 'info' });
      } else {
        await axios.post(`${BASE_URL}/favorites`, {
          user_id,
          product_id: product.product_id
        });
        setAlert({ open: true, message: `Đã thêm '${product.name}' vào yêu thích!`, severity: 'success' });
      }
    } catch (error) {
      setAlert({ open: true, message: 'Lỗi khi cập nhật danh sách yêu thích.', severity: 'error' });
      // Rollback
      if (isCurrentlyFavorite) {
        newSet.add(product.product_id);
      } else {
        newSet.delete(product.product_id);
      }
      setFavorites(newSet);
      console.error("Lỗi cập nhật yêu thích:", error);
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Box sx={{ px: 3, py: 5 }}>
      <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
        CHĂM SÓC DA HIỆU QUẢ
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => fetchProductsByTab(cat.slug)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: cat.slug === activeCategorySlug ? '#222' : '#eee',
              color: cat.slug === activeCategorySlug ? '#fff' : '#000',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {cat.category_name}
          </button>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'scroll',
          gap: 2,
          pb: 2,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {products.map(product => {
          const isFavorite = favorites.has(product.product_id);
          return (
            <Link
              key={product.product_id}
              to={`/products/${product.product_id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Paper
                sx={{
                  p: 2,
                  width: 300,
                  minHeight: 400,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  borderRadius: '8px',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
                  '&:hover': { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' },
                  backgroundColor: '#fff',
                  textAlign: 'center'
                }}
              >
                <Box sx={{
                  width: '100%', height: '250px', overflow: 'hidden',
                  mb: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img
                    src={`${UPLOADS_BASE_URL}${product.thumbnail}`}
                    alt={product.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/240x240?text=No+Image';
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'start',
                    mb: 2,
                    fontSize: '1.1rem',
                    minHeight: '2.6em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {product.name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {Number(product.price).toLocaleString('vi-VN')}₫
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      sx={{ color: isFavorite ? 'black' : '#333' }}
                      onClick={(e) => handleToggleFavorite(e, product, isFavorite)}
                    >
                      {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </IconButton>

                    <IconButton
                      size="small"
                      sx={{ color: '#333' }}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCartOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Link>
          );
        })}
      </Box>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity as any} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
