import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  InputAdornment, MenuItem, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  category_id: number;
  brand_id: number;
}

interface Category {
  category_id: number; // ✅ đổi từ id thành category_id
  category_name: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

const BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', quantity: '', thumbnail: null as File | null,
    previewUrl: '', category_id: '', brand_id: ''
  });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
    axios.get(`${BASE_URL}/categories`).then(res => {
      console.log('CATEGORIES:', res.data); // 👈 kiểm tra
      setCategories(res.data);
    });
    axios.get(`${BASE_URL}/brands`).then(res => setBrands(res.data));
  }, []);
  

  const fetchProducts = async () => {
    const res = await axios.get(`${BASE_URL}/products`);
    setProducts(res.data);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '', description: '', price: '', quantity: '', thumbnail: null,
      previewUrl: '', category_id: '', brand_id: ''
    });
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      thumbnail: null,
      previewUrl: product.thumbnail ? `${BASE_URL}/uploads/${product.thumbnail}` : '',
      category_id: String(product.category_id),
      brand_id: String(product.brand_id)
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      await axios.delete(`${BASE_URL}/products/${id}`);
      setAlert({ open: true, message: '🗑️ Xoá sản phẩm thành công', severity: 'info' });
      fetchProducts();
    }
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const previewUrl = file ? URL.createObjectURL(file) : '';
    setFormData({ ...formData, thumbnail: file, previewUrl });
  };

  const handleSave = async () => {
    const categoryId = Number(formData.category_id);
    const brandId = Number(formData.brand_id);

    if (!formData.name || !formData.price || !formData.quantity || isNaN(categoryId) || isNaN(brandId)) {
      setAlert({ open: true, message: '❌ Vui lòng điền đầy đủ thông tin hợp lệ', severity: 'warning' });
      return;
    }

    if (!editingProduct && !formData.thumbnail) {
      setAlert({ open: true, message: '❌ Vui lòng chọn ảnh sản phẩm', severity: 'error' });
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price.replace(',', '.'));
    data.append('quantity', formData.quantity);
    data.append('category_id', String(categoryId));
    data.append('brand_id', String(brandId));
    if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

    try {
      if (editingProduct) {
        await axios.put(`${BASE_URL}/products/${editingProduct.product_id}`, data);
        setAlert({ open: true, message: '✅ Cập nhật sản phẩm thành công', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/products`, data);
        setAlert({ open: true, message: '✅ Thêm sản phẩm thành công', severity: 'success' });
      }
      fetchProducts();
      setOpenDialog(false);
    } catch (err) {
      console.error('Save error:', err);
      setAlert({ open: true, message: '❌ Lỗi khi lưu sản phẩm', severity: 'error' });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.product_id).includes(searchTerm)
    );
  }, [products, searchTerm]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Quản lý Sản phẩm</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
          variant="outlined" size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={handleOpenAdd}>Thêm sản phẩm</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p.product_id}>
                <TableCell>{p.product_id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{Number(p.price).toLocaleString()}₫</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>
  <Box
    sx={{
      width: 80,
      height: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: '8px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
    }}
  >
    {p.thumbnail ? (
      <img
      src={`${UPLOADS_BASE_URL}${p.thumbnail}`}
      alt={p.name}
      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image';
      }}
    />
    
    ) : (
      <Typography variant="caption" color="text.secondary">Không có ảnh</Typography>
    )}
  </Box>
</TableCell>

<TableCell>
        {categories.find(c => c.category_id === p.category_id)?.category_name || '—'}
      </TableCell>
                <TableCell>{brands.find(b => b.brand_id === p.brand_id)?.brand_name || '—'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(p)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.product_id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog form */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Tên" margin="dense" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField fullWidth label="Mô tả" margin="dense" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <TextField fullWidth label="Giá" type="number" margin="dense" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
          <TextField fullWidth label="Số lượng" type="number" margin="dense" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />

          <TextField
  select
  fullWidth
  label="Danh mục"
  margin="dense"
  value={formData.category_id}
  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
>
  {categories.map((c) => (
    <MenuItem key={c.category_id} value={String(c.category_id)}>
      {c.category_name}
    </MenuItem>
  ))}
</TextField>





          <TextField select fullWidth label="Thương hiệu" margin="dense"
            value={formData.brand_id} onChange={e => setFormData({ ...formData, brand_id: e.target.value })}>
            {brands.map(b => (
              <MenuItem key={b.brand_id} value={String(b.brand_id)}>{b.brand_name}</MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 2 }} component="label">
            <Box
              sx={{
                width: 100, height: 100, border: '1px dashed #ccc', display: 'flex',
                alignItems: 'center', justifyContent: 'center', position: 'relative',
                overflow: 'hidden', cursor: 'pointer', backgroundColor: '#fafafa'
              }}
            >
              {formData.previewUrl ? (
                <>
                  <img src={formData.previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Button
                    size="small" color="error" sx={{
                      position: 'absolute', top: 2, right: 2, fontSize: 10, minWidth: 'unset', px: 1
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      setFormData({ ...formData, thumbnail: null, previewUrl: '' });
                    }}
                  >X</Button>
                </>
              ) : (
                <Typography variant="caption">Chọn ảnh</Typography>
              )}
            </Box>
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity as any} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
