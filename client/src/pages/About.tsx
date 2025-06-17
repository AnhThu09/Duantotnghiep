import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Pagination
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const brands = ['The Ordinary', 'Neutrogena', 'MAC', 'La Roche Posay', 'IOPE', 'Some By Mi'];
const categories = ['Chăm sóc da', 'Trang điểm', 'Chống nắng', 'Mặt nạ', 'Tẩy trang'];
const ratings = ['5 sao trở lên', '4 sao trở lên', '3 sao trở lên', '2 sao trở lên', '1 sao trở lên'];

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Lỗi khi tải sản phẩm:', err));
  }, []);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  return (
    <Box sx={{ width: '100%', px: 2, py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tất cả sản phẩm
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Khám phá bộ sưu tập mỹ phẩm chính hãng
      </Typography>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Sidebar */}
        <Box sx={{ width: 250, flexShrink: 0 }}>
          <Typography fontWeight="bold" mb={1}>Thương hiệu</Typography>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={<Checkbox sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />}
                label={brand}
              />
            ))}
          </FormGroup>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>Danh mục</Typography>
            <FormGroup>
              {categories.map((cat) => (
                <FormControlLabel
                  key={cat}
                  control={<Checkbox sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />}
                  label={cat}
                />
              ))}
            </FormGroup>
          </Box>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>Khoảng giá</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={2000000}
              sx={{ color: '#e91e63' }}
            />
            <Typography variant="body2">
              {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>Đánh giá</Typography>
            <FormGroup>
              {ratings.map((rate) => (
                <FormControlLabel
                  key={rate}
                  control={<Checkbox sx={{ color: '#e91e63', '&.Mui-checked': { color: '#e91e63' } }} />}
                  label={rate}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>

        {/* Product List */}
        <Box sx={{ flex: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}> {/* Thay đổi giá trị marginBottom */}
    Hiển thị {products.length} sản phẩm
  </Typography>
  <Select size="small" defaultValue="mới nhất" sx={{ marginTop: '-30px' }}> {/* Thay đổi marginTop */}
    <MenuItem value="mới nhất">Mới nhất</MenuItem>
    <MenuItem value="giá tăng">Giá tăng dần</MenuItem>
    <MenuItem value="giá giảm">Giá giảm dần</MenuItem>
  </Select>
</Box>

          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product.id}
                sx={{ display: 'flex' }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 3,
                    width: '100%', // Đảm bảo chiều rộng đồng nhất
                    maxWidth: 250, // Thiết lập chiều rộng tối đa
                    height: '100%', // Đảm bảo chiều cao đồng nhất
                  }}
                >
                  <Box position="relative">
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        height: 160,
                        objectFit: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'grey.100' },
                      }}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%', // Đảm bảo chiều cao đồng nhất
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {product.brand}
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      mt={1}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography fontSize={13} color="text.secondary">
                      {'⭐'.repeat(product.rating)} ({product.reviewCount})
                    </Typography>

                    <Typography fontWeight="bold" color="primary" mt={1}>
                      {product.price}
                    </Typography>

                    <Box textAlign="right" mt="auto">
                      <IconButton color="primary">
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination count={3} color="primary" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}