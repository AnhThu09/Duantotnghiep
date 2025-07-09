import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Snackbar,
  Alert
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rating } from '@mui/material';
import ProductDisplayPage from "./ProductDisplayPage"
import FeaturedSection from "./FeaturedSection"

const BASE_URL = 'http://localhost:3000/api';
const UPLOADS = 'http://localhost:3000/uploads/';
const USER_ID = 1;
const PRODUCTS_PER_PAGE = 12;

export default function ProductListWithFilters() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const [filters, setFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    ratings: [] as number[],
    price: [0, 2000000],
  });
  const [sortOption, setSortOption] = useState('mới nhất');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        axios.get(`${BASE_URL}/products`),
        axios.get(`${BASE_URL}/categories`),
        axios.get(`${BASE_URL}/brands`),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setBrands(brandRes.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFavoriteToggle = async (productId: number) => {
    try {
      if (favorites.includes(productId)) {
        await axios.delete(`${BASE_URL}/favorites/user/${USER_ID}/product/${productId}`);
        setFavorites(prev => prev.filter(id => id !== productId));
        setAlert({ open: true, message: '🗑️ Đã xoá khỏi yêu thích', severity: 'info' });
      } else {
        await axios.post(`${BASE_URL}/favorites`, { user_id: USER_ID, product_id: productId });
        setFavorites(prev => [...prev, productId]);
        setAlert({ open: true, message: '💖 Đã thêm vào yêu thích', severity: 'success' });
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật yêu thích:', err);
    }
  };

  const handleFilterChange = (type: string, value: string | number) => {
    setFilters(prev => {
      const newArr = prev[type as keyof typeof prev] as any[];
      const index = newArr.indexOf(value);
      const updated = index === -1 ? [...newArr, value] : newArr.filter(i => i !== value);
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (_e: Event, newValue: number | number[]) => {
    setFilters(prev => ({ ...prev, price: newValue as number[] }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortedFilteredProducts = products
    .filter(p => {
      const matchBrand = filters.brands.length === 0 || filters.brands.includes(p.brand_id.toString());
      const matchCat = filters.categories.length === 0 || filters.categories.includes(p.category_id.toString());
      const matchRating = filters.ratings.length === 0 || filters.ratings.some(r => p.rating >= r);
      const matchPrice = p.price >= filters.price[0] && p.price <= filters.price[1];
      return matchBrand && matchCat && matchRating && matchPrice;
    })
    .sort((a, b) => {
      if (sortOption === 'giá tăng') return a.price - b.price;
      if (sortOption === 'giá giảm') return b.price - a.price;
      return b.product_id - a.product_id;
    });

  const paginatedProducts = sortedFilteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <Box sx={{ width: '100%', px: 4, py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tất cả sản phẩm
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Khám phá bộ sưu tập mỹ phẩm chính hãng
      </Typography>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ width: 250 }}>
          <Typography fontWeight="bold" mb={1}>Thương hiệu</Typography>
          <FormGroup>
            {brands.map(b => (
              <FormControlLabel
                key={b.brand_id}
                control={<Checkbox checked={filters.brands.includes(String(b.brand_id))} onChange={() => handleFilterChange('brands', String(b.brand_id))} sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />}
                label={b.brand_name}
              />
            ))}
          </FormGroup>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>Danh mục</Typography>
            <FormGroup>
              {categories.map(c => (
                <FormControlLabel
                  key={c.category_id}
                  control={<Checkbox checked={filters.categories.includes(String(c.category_id))} onChange={() => handleFilterChange('categories', String(c.category_id))} sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />}
                  label={c.category_name}
                />
              ))}
            </FormGroup>
          </Box>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>Khoảng giá</Typography>
            <Slider value={filters.price} onChange={handlePriceChange} valueLabelDisplay="auto" min={0} max={2000000} sx={{ color: '#e91e63' }} />
            <Typography variant="body2">
              {filters.price[0].toLocaleString()}đ - {filters.price[1].toLocaleString()}đ
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>Đánh giá</Typography>
            <FormGroup>
              {[5, 4, 3, 2, 1].map(rating => (
                <FormControlLabel
                  key={rating}
                  control={<Checkbox checked={filters.ratings.includes(rating)} onChange={() => handleFilterChange('ratings', rating)} sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />}
                  label={`${rating} sao trở lên`}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>

        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1">Hiển thị {sortedFilteredProducts.length} sản phẩm</Typography>
            <Select size="small" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <MenuItem value="mới nhất">Mới nhất</MenuItem>
              <MenuItem value="giá tăng">Giá tăng dần</MenuItem>
              <MenuItem value="giá giảm">Giá giảm dần</MenuItem>
            </Select>
          </Box>

          <Grid container spacing={2}>
            {paginatedProducts.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.product_id}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Card
  sx={{
    p: 2,
    height: '100%',
    width: 261,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRadius: 2,
    border: '1px solid #e0e0e0',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    }
  }}
  onClick={() => navigate(`/products/${product.product_id}`)}
>
  <Box sx={{ position: 'relative', width: '100%', height: 200, mb: 2 }}>
    <CardMedia
      component="img"
      image={product.thumbnail ? `${UPLOADS}${product.thumbnail}` : 'https://via.placeholder.com/240x200?text=No+Image'}
      alt={product.name}
      sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
    />
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        handleFavoriteToggle(product.product_id);
      }}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        bgcolor: 'white',
        '&:hover': { bgcolor: 'grey.100' },
      }}
    >
      {favorites.includes(product.product_id)
        ? <FavoriteIcon sx={{ color: '#e91e63' }} />
        : <FavoriteBorderIcon sx={{ color: '#aaa' }} />}
    </IconButton>
  </Box>

  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
    <Typography variant="caption" color="text.secondary">
      {product.brand_name}
    </Typography>

    <Typography
      variant="subtitle2"
      fontWeight="bold"
      mt={0.5}
      sx={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minHeight: '2.6em',
      }}
    >
      {product.name}
    </Typography>

    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
  <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
  <Typography variant="caption" color="text.secondary">({product.reviewCount || 0})</Typography>
</Box>


<Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
  <Typography fontWeight="bold" color="primary" fontSize="1rem">
    {Number(product.price).toLocaleString()}₫
  </Typography>
  <IconButton color="primary" size="small">
    <AddShoppingCartIcon />
  </IconButton>
</Box>

  </Box>
</Card>

                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="flex-start" sx={{ mt: 4, ml: 45 }}>
  <Pagination
    count={Math.ceil(sortedFilteredProducts.length / PRODUCTS_PER_PAGE)}
    page={currentPage}
    onChange={handlePageChange}
    color="primary"
  />
</Box>

        </Box>
      </Box>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity as any} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar> <br />
      <FeaturedSection 
  smallHeading="Hôm nay bạn muốn săn sản phẩm gì?"
  largeHeading="Khám phá vẻ đẹp tự nhiên, tỏa sáng mỗi ngày"
  description="Từ những dòng serum dưỡng da chuyên sâu đến bảng màu son rực rỡ, chúng tôi mang đến các sản phẩm mỹ phẩm chính hãng giúp bạn tỏa sáng với phong cách riêng. Hãy bắt đầu hành trình làm đẹp cùng chúng tôi ngay hôm nay!"
  buttonText="XEM NGAY"
  buttonLink="/products"
  mainImage="https://www.lemon8-app.com/seo/image?item_id=7299463717391991297&index=0&sign=d309ed598e6fa9b3778efccb76f8fa3b"
/>

      <ProductDisplayPage/>
    </Box>
  );
}
