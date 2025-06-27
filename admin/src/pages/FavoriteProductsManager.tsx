import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Favorite {
  favorite_id: number;
  user_id: number;
  product: {
    product_id: number;
    name: string;
    price: number;
    thumbnail?: string;
    category: {
      category_name: string;
    };
  };
}

const BASE_URL = 'http://localhost:3000/api';

export default function FavoriteProductsManager() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/favorites`);
      setFavorites(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm yêu thích:', err);
    }
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá khỏi yêu thích?')) return;
    try {
      await axios.delete(`${BASE_URL}/favorites/${favoriteId}`);
      setFavorites(favorites.filter(f => f.favorite_id !== favoriteId));
    } catch (err) {
      console.error('Lỗi khi xoá yêu thích:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Sản phẩm Yêu thích</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favorites.map((fav) => (
              <TableRow key={fav.favorite_id}>
                <TableCell>{fav.product.name}</TableCell>
                <TableCell>{fav.product.category?.category_name || '—'}</TableCell>
                <TableCell>{fav.product.price.toLocaleString()}₫</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleRemoveFavorite(fav.favorite_id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {favorites.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">Không có sản phẩm yêu thích nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
