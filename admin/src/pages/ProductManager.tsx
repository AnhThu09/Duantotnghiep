import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  InputAdornment, MenuItem, Snackbar, Alert, CircularProgress // Thêm CircularProgress nếu bạn muốn hiển thị loading
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
  // Thêm các trường khác nếu có, ví dụ:
  // created_at?: string;
  // updated_at?: string;
}

interface Category {
  category_id: number;
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
  const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải
  const [error, setError] = useState<string | null>(null); // State để lưu lỗi

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', quantity: '', thumbnail: null as File | null,
    previewUrl: '', category_id: '', brand_id: ''
  });
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });

  // ✅ Hàm fetchProducts được sửa đổi để nhận tham số tìm kiếm
  const fetchProducts = useCallback(async (searchQuery: string = '') => {
    setLoading(true);
    setError(null);
    try {
      // Xây dựng URL API với tham số search
      const url = searchQuery
        ? `${BASE_URL}/products?search=${encodeURIComponent(searchQuery)}`
        : `${BASE_URL}/products`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      setProducts([]); // Xóa dữ liệu cũ nếu có lỗi
    } finally {
      setLoading(false);
    }
  }, []); // useCallback để tránh tạo lại hàm không cần thiết

  // ✅ useEffect để tải sản phẩm ban đầu và khi searchTerm thay đổi
  useEffect(() => {
    fetchProducts(searchTerm); // Tải sản phẩm khi component mount và khi searchTerm thay đổi
  }, [searchTerm, fetchProducts]); // Dependency array bao gồm searchTerm và fetchProducts

  // useEffect để tải danh mục và thương hiệu (chỉ chạy một lần)
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${BASE_URL}/categories`),
          axios.get(`${BASE_URL}/brands`)
        ]);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (err) {
        console.error('Lỗi khi tải danh mục hoặc thương hiệu:', err);
        setAlert({ open: true, message: '❌ Lỗi khi tải danh mục hoặc thương hiệu.', severity: 'error' });
      }
    };
    fetchCategoriesAndBrands();
  }, []);

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
      previewUrl: product.thumbnail ? `${UPLOADS_BASE_URL}${product.thumbnail}` : '', // Sửa đường dẫn thumbnail
      category_id: String(product.category_id),
      brand_id: String(product.brand_id)
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      try {
        await axios.delete(`${BASE_URL}/products/${id}`);
        setAlert({ open: true, message: '🗑️ Xoá sản phẩm thành công', severity: 'info' });
        fetchProducts(searchTerm); // Tải lại danh sách sau khi xóa, giữ nguyên từ khóa tìm kiếm
      } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        setAlert({ open: true, message: '❌ Lỗi khi xoá sản phẩm', severity: 'error' });
      }
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
    const priceNum = Number(formData.price);
    const quantityNum = Number(formData.quantity);

    if (!formData.name || !formData.description || isNaN(priceNum) || isNaN(quantityNum) || isNaN(categoryId) || isNaN(brandId)) {
      setAlert({ open: true, message: '❌ Vui lòng điền đầy đủ thông tin hợp lệ (giá, số lượng phải là số).', severity: 'warning' });
      return;
    }

    // Kiểm tra nếu là thêm mới và không có thumbnail
    if (!editingProduct && !formData.thumbnail) {
      setAlert({ open: true, message: '❌ Vui lòng chọn ảnh sản phẩm.', severity: 'error' });
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', String(priceNum)); // Đảm bảo gửi số
    data.append('quantity', String(quantityNum)); // Đảm bảo gửi số
    data.append('category_id', String(categoryId));
    data.append('brand_id', String(brandId));
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    } else if (editingProduct && editingProduct.thumbnail) {
      // Nếu đang sửa và không chọn ảnh mới, gửi lại tên ảnh cũ
      // Backend của bạn đã xử lý trường hợp này, nên không cần gửi lại thumbnail nếu không có file mới
      // data.append('thumbnail', editingProduct.thumbnail); // Có thể bỏ dòng này nếu backend xử lý tốt
    }


    try {
      if (editingProduct) {
        await axios.put(`${BASE_URL}/products/${editingProduct.product_id}`, data);
        setAlert({ open: true, message: '✅ Cập nhật sản phẩm thành công', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/products`, data);
        setAlert({ open: true, message: '✅ Thêm sản phẩm thành công', severity: 'success' });
      }
      fetchProducts(searchTerm); // Tải lại danh sách sau khi lưu
      handleCloseDialog(); // Đóng dialog sau khi lưu thành công
    } catch (err: any) { // Thêm kiểu any cho err để truy cập response
      console.error('Save error:', err.response?.data || err.message);
      setAlert({ open: true, message: `❌ Lỗi khi lưu sản phẩm: ${err.response?.data?.error || err.message}`, severity: 'error' });
    }
  };

  // ✅ Không cần useMemo cho filteredProducts nữa vì API đã filter
  // const filteredProducts = useMemo(() => {
  //   return products.filter((p) =>
  //     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     String(p.product_id).includes(searchTerm)
  //   );
  // }, [products, searchTerm]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải sản phẩm...</Typography>
      </Box>
    );
<<<<<<< HEAD
  }, [products, searchTerm]);
  return (
    <Box>
        <style>{`
        /* Buộc nút có chiều rộng 120px */
        .MuiDialogActions-root button {
            width: 120px !important;
            min-width: 120px !important;
        }
        /* Đảm bảo chúng luôn nằm ngang */
        .MuiDialogActions-root {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            justify-content: flex-end !important; /* hoặc center nếu bạn muốn */
            align-items: center !important;
        }
      `}</style>
=======
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => fetchProducts(searchTerm)} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
>>>>>>> 46df13841756a2d6566bd875c58dccb54aa00ad3
      <Typography variant="h5" gutterBottom>Quản lý Sản phẩm</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        {/* TextField tìm kiếm */}
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { // Bắt sự kiện nhấn Enter
            if (e.key === 'Enter') {
              fetchProducts(searchTerm); // Gọi hàm fetchProducts khi nhấn Enter
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            // ✅ Nút tìm kiếm (có thể bỏ qua nếu bạn chỉ muốn tìm kiếm khi nhấn Enter)
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => fetchProducts(searchTerm)}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' }}
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
<<<<<<< HEAD
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
                 <TableCell align="right" sx={{ width: '120px', minWidth: '120px' }}> {/* ✅ Đặt width cho cell hành động */}
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleEdit(p)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(p.product_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
=======
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Không tìm thấy sản phẩm nào.
                </TableCell>
>>>>>>> 46df13841756a2d6566bd875c58dccb54aa00ad3
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell>{p.product_id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description ? p.description.substring(0, 50) + (p.description.length > 50 ? '...' : '') : '—'}</TableCell>
                  {/* Dòng này đã được chỉnh sửa */}
                  <TableCell>{Number(p.price).toLocaleString('vi-VN')}₫</TableCell>
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
                            e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image'; // Ảnh thay thế
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog form */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Tên" margin="dense"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth label="Mô tả" margin="dense" multiline rows={3} // Cho phép nhiều dòng
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            fullWidth label="Giá" type="number" margin="dense"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            inputProps={{ min: "0" }} // Chỉ cho phép giá trị không âm
          />
          <TextField
            fullWidth label="Số lượng" type="number" margin="dense"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            inputProps={{ min: "0" }} // Chỉ cho phép giá trị không âm
          />

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

          <TextField
            select
            fullWidth
            label="Thương hiệu"
            margin="dense"
            value={formData.brand_id}
            onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
          >
            {brands.map(b => (
              <MenuItem key={b.brand_id} value={String(b.brand_id)}>{b.brand_name}</MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 2 }} component="label">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Ảnh sản phẩm</Typography>
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
                      position: 'absolute', top: 2, right: 2, fontSize: 10, minWidth: 'unset', px: 1, py: '2px' // Điều chỉnh kích thước nút X
                    }}
                    onClick={e => {
                      e.stopPropagation(); // Ngăn chặn mở file input khi bấm nút X
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
        <DialogActions >
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}