import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const mockFavorites: Product[] = [
  { id: 101, name: 'Kem dưỡng trắng da', category: 'Chăm sóc da', price: 320000 },
  { id: 102, name: 'Mascara dài mi', category: 'Trang điểm', price: 210000 },
];

export default function FavoriteProductsManager() {
  const [favorites, setFavorites] = useState<Product[]>(mockFavorites);

  const handleRemoveFavorite = (id: number) => {
    const confirm = window.confirm('Bạn có chắc muốn bỏ yêu thích sản phẩm này?');
    if (confirm) {
      setFavorites(favorites.filter((product) => product.id !== id));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Sản phẩm Yêu thích
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          border: '1px solid #ddd',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Giá</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {favorites.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell sx={{ borderRight: '1px solid #eee' }}>{product.name}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #eee' }}>{product.category}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #eee' }}>
                  {product.price.toLocaleString()}₫
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleRemoveFavorite(product.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {favorites.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có sản phẩm yêu thích nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
