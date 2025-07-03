// File: ProductByCategoryScroll.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Paper, IconButton, Snackbar, Alert, useTheme
} from '@mui/material';
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
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('serum'); // ✅ mặc định là 'serum'
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const user_id = 1;

  useEffect(() => {
    axios.get(`${BASE_URL}/categories`)
      .then(res => {
        const filtered = res.data.filter((cat: Category) => TABS_TO_DISPLAY.includes(cat.slug));
        setCategories(filtered);
      });
  }, []);

  useEffect(() => {
    const slugToUse = urlSlug || 'serum'; // ✅ nếu không có slug, dùng 'serum'
    setActiveCategorySlug(slugToUse);
    axios.get(`${BASE_URL}/products/category/${slugToUse}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [urlSlug]);

  const fetchProductsByTab = (tabSlug: string) => {
    setActiveCategorySlug(tabSlug);
    axios.get(`${BASE_URL}/products/category/${tabSlug}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  };

  const handleAddToCart = async (product: Product) => {
    if (!user_id) {
      return setAlert({ open: true, message: '❌ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', severity: 'warning' });
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

  const handleAddToFavorites = (product: Product) => {
    setAlert({ open: true, message: `✅ Đã thêm '${product.name}' vào danh sách yêu thích!`, severity: 'info' });
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

      {/* ✅ KHÔNG CHO CUỘN NGANG */}
          <Box
            sx={{
              display: 'flex',
              overflowX: 'scroll',       // ✅ giữ hiệu ứng trượt ngang
              gap: 2,
              pb: 2,
              scrollBehavior: 'smooth',  // ✅ trượt mượt
              '&::-webkit-scrollbar': {
                display: 'none'          // ✅ ẩn scrollbar cho Chrome, Safari
              },
              msOverflowStyle: 'none',   // ✅ ẩn scrollbar cho IE
              scrollbarWidth: 'none',    // ✅ ẩn scrollbar cho Firefox
            }}
          >
        {products.map(product => (
          <Paper key={product.product_id}
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
              '&:hover': {
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
              },
              backgroundColor: '#fff',
              textAlign: 'center'
            }}
          >
            <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', mb: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <IconButton size="small" sx={{ color: '#333' }} onClick={() => handleAddToFavorites(product)}>
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#333' }} onClick={() => handleAddToCart(product)}>
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity as any} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
