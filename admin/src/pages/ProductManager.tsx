import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Son môi đỏ', category: 'Trang điểm', price: 250000, stock: 12 },
  { id: 2, name: 'Kem dưỡng da ban đêm', category: 'Chăm sóc da', price: 350000, stock: 8 },
  { id: 3, name: 'Nước hoa hồng', category: 'Chăm sóc da', price: 190000, stock: 15 },
];

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenAdd = () => {
    setEditingProduct(null); // Reset form
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xoá sản phẩm này?');
    if (confirmDelete) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (editingProduct) {
      // Sửa sản phẩm
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
    } else {
      // Thêm sản phẩm
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setOpenDialog(false);
  };

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  // Cập nhật form khi chỉnh sửa
  React.useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
      });
    } else {
      setFormData({ name: '', category: '', price: '', stock: '' });
    }
  }, [editingProduct]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Quản lý Sản phẩm
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Thêm sản phẩm
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price.toLocaleString()}₫</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(product)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Thêm / Sửa sản phẩm */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Tên sản phẩm"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Danh mục"
            margin="dense"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <TextField
            fullWidth
            label="Giá"
            type="number"
            margin="dense"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            fullWidth
            label="Số lượng"
            type="number"
            margin="dense"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
