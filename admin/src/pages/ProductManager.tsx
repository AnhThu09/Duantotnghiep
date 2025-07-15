import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, Grid, Rating,
  TextField, InputAdornment, MenuItem, Snackbar, Alert as MuiAlert, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Stack, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
import { type AlertProps } from '@mui/material/Alert';
import { type AlertColor } from '@mui/material/Alert';

// Custom Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// --- INTERFACES ---
interface Product {
  product_id: number;
  name: string;
  description: string | null; // Cho phép description là null
  short_description: string | null; // ✅ Bổ sung: Cho phép short_description là null
  price: number;
  quantity: number;
  thumbnail?: string | null;
  category_id: number;
  brand_id: number;
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
  const theme = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States cho phân trang
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // States cho dialog xác nhận xóa
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '', description: '', short_description: '', // ✅ Bổ sung short_description vào formData
    price: '', quantity: '', thumbnail: null as File | null,
    previewUrl: '', category_id: '', brand_id: ''
  });
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: AlertColor }>({ open: false, message: '', severity: 'success' });

  // --- API CALLS ---
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      
      const sortedProducts: Product[] = res.data.map((p: any) => ({
        ...p,
        description: p.description ?? null,
        short_description: p.short_description ?? null, // ✅ Xử lý short_description từ API
        thumbnail: p.thumbnail ?? null,
        product_id: Number(p.product_id),
        category_id: Number(p.category_id),
        brand_id: Number(p.brand_id),
      })).sort((b, a) => b.product_id - a.product_id);
      
      setProducts(sortedProducts);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  // --- HANDLERS ---
  const handleOpenAdd = useCallback(() => {
    setEditingProduct(null);
    setFormData({
      name: '', description: '', short_description: '', // ✅ Khởi tạo short_description
      price: '', quantity: '', thumbnail: null,
      previewUrl: '', category_id: '', brand_id: ''
    });
    setOpenDialog(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description ?? '',
      short_description: product.short_description ?? '', // ✅ Gán giá trị short_description khi chỉnh sửa
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      thumbnail: null,
      previewUrl: product.thumbnail ? `${UPLOADS_BASE_URL}${product.thumbnail}` : '',
      category_id: String(product.category_id),
      brand_id: String(product.brand_id)
    });
    setOpenDialog(true);
  }, []);

  const handleDeleteConfirm = useCallback((productId: number) => {
    setDeletingId(productId);
    setOpenConfirmDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    try {
      await axios.delete(`${BASE_URL}/products/${deletingId}`);
      setAlert({ open: true, message: '🗑️ Xoá sản phẩm thành công', severity: 'info' });
      setOpenConfirmDialog(false);
      setDeletingId(null);
      fetchProducts();
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      setAlert({ open: true, message: '❌ Lỗi khi xoá sản phẩm', severity: 'error' });
    }
  }, [deletingId, fetchProducts]);

  const handleCloseConfirmDialog = useCallback(() => {
    setOpenConfirmDialog(false);
    setDeletingId(null);
  }, []);

  const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

  // Pagination Handlers
  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Search Handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  }, []);
  
  // Xử lý thay đổi ảnh
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const previewUrl = file ? URL.createObjectURL(file) : '';
    setFormData(prev => ({ ...prev, thumbnail: file, previewUrl }));
  }, []);

  // Lưu sản phẩm (thêm mới hoặc cập nhật)
  const handleSave = useCallback(async () => {
    const categoryId = Number(formData.category_id);
    const brandId = Number(formData.brand_id);
    const priceNum = Number(formData.price);
    const quantityNum = Number(formData.quantity);

    // ✅ Sửa lỗi kiểm tra validate
    if (!formData.name || !formData.description || !formData.short_description || isNaN(priceNum) || isNaN(quantityNum) || isNaN(categoryId) || isNaN(brandId) || priceNum < 0 || quantityNum < 0) {
      setAlert({ open: true, message: '❌ Vui lòng điền đầy đủ thông tin hợp lệ (tên, mô tả, giá, số lượng, danh mục, thương hiệu phải là số không âm).', severity: 'warning' });
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
    data.append('short_description', formData.short_description); // ✅ Gửi short_description
    data.append('price', String(priceNum));
    data.append('quantity', String(quantityNum));
    data.append('category_id', String(categoryId));
    data.append('brand_id', String(brandId));
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      if (editingProduct) {
        await axios.put(`${BASE_URL}/products/${editingProduct.product_id}`, data);
        setAlert({ open: true, message: '✅ Cập nhật sản phẩm thành công', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/products`, data);
        setAlert({ open: true, message: '✅ Thêm sản phẩm thành công', severity: 'success' });
        setPage(0); 
      }
      fetchProducts(); 
      handleCloseDialog();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Save error:', err.response?.data || err.message);
        setAlert({ open: true, message: `❌ Lỗi khi lưu sản phẩm: ${err.response?.data?.message || err.message}`, severity: 'error' });
      } else if (err instanceof Error) {
        console.error('Save error:', err.message);
        setAlert({ open: true, message: `❌ Lỗi khi lưu sản phẩm: ${err.message}`, severity: 'error' });
      } else {
        console.error('Save error:', err);
        setAlert({ open: true, message: '❌ Lỗi không xác định khi lưu sản phẩm.', severity: 'error' });
      }
    }
  }, [editingProduct, formData, fetchProducts, handleCloseDialog, categories, brands]); 

  // Memoized data for table display (Client-side filtering and pagination)
  const filteredAndPaginatedProducts = useMemo(() => {
    let currentProducts = products;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter((product) =>
        String(product.product_id).includes(lowerCaseSearchTerm) || 
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        // ✅ Xử lý mô tả có thể null
        (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (product.short_description && product.short_description.toLowerCase().includes(lowerCaseSearchTerm)) || // ✅ Tìm kiếm theo short_description
        String(product.price).includes(lowerCaseSearchTerm) || 
        String(product.quantity).includes(lowerCaseSearchTerm) ||
        (categories.find(c => c.category_id === product.category_id)?.category_name?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (brands.find(b => b.brand_id === product.brand_id)?.brand_name?.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    
    const startIndex = page * rowsPerPage;
    return currentProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [products, searchTerm, page, rowsPerPage, categories, brands]); 

  // Total count for TablePagination (after client-side filtering)
  const totalFilteredProductCount = useMemo(() => {
    let currentProducts = products;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter((product) =>
        String(product.product_id).includes(lowerCaseSearchTerm) ||
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (product.short_description && product.short_description.toLowerCase().includes(lowerCaseSearchTerm)) || // ✅ Tìm kiếm theo short_description
        String(product.price).includes(lowerCaseSearchTerm) ||
        String(product.quantity).includes(lowerCaseSearchTerm) ||
        (categories.find(c => c.category_id === product.category_id)?.category_name?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (brands.find(b => b.brand_id === product.brand_id)?.brand_name?.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    return currentProducts.length;
  }, [products, searchTerm, categories, brands]);


  // --- Conditional Rendering for Loading State ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải sản phẩm...</Typography>
      </Box>
    );
  }

  // --- Conditional Rendering for Error State ---
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchProducts} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  // --- Main Component JSX Return ---
  return (
    <Box sx={{ p: 3 }}>
     <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
            mb: 4,
            fontWeight: 'bold',
            color: 'rgb(17, 82, 147)' 
        }}
    >
        Quản lý sản phẩm
    </Typography>
      <Paper sx={{ p: 3, boxShadow: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm sản phẩm..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && ( 
                    <IconButton onClick={() => setSearchTerm('')} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>Thêm sản phẩm</Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Mô tả ngắn</TableCell> {/* ✅ Bổ sung cột Mô tả ngắn */}
                <TableCell>Mô tả dài</TableCell> {/* Đổi tên thành Mô tả dài */}
                <TableCell>Giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Thương hiệu</TableCell>
                <TableCell sx={{ width: '120px', minWidth: '120px' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndPaginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center"> {/* ✅ Sửa colSpan thành 10 */}
                    Không tìm thấy sản phẩm nào.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndPaginatedProducts.map((p) => (
                  <TableRow key={p.product_id}>
                    <TableCell>{p.product_id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    {/* ✅ Hiển thị mô tả ngắn */}
                    <TableCell>{p.short_description ? p.short_description.substring(0, 50) + (p.short_description.length > 50 ? '...' : '') : '—'}</TableCell>
                    {/* ✅ Hiển thị mô tả dài */}
                    <TableCell>{p.description ? p.description.substring(0, 50) + (p.description.length > 50 ? '...' : '') : '—'}</TableCell>
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
                    <TableCell align="right" sx={{ width: '120px', minWidth: '120px' }}>
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
                        onClick={() => handleDeleteConfirm(p.product_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalFilteredProductCount} // Sử dụng tổng số sản phẩm đã lọc
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count === -1 ? `hơn ${to}` : count}`
          }
        />
      </Paper>

      {/* Dialog form */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}> {/* Use Stack for consistent spacing */}
            <TextField
              fullWidth label="Tên" margin="dense"
              name="name" // Add name prop for consistent handling
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth label="Mô tả ngắn" margin="dense" multiline rows={3}
              name="short_description" // ✅ Bổ sung TextField cho short_description
              value={formData.short_description}
              onChange={e => setFormData({ ...formData, short_description: e.target.value })}
            />
            <TextField
              fullWidth label="Mô tả dài" margin="dense" multiline rows={3}
              name="description" // Add name prop
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              fullWidth label="Giá" type="number" margin="dense"
              name="price" // Add name prop
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              inputProps={{ min: "0" }}
            />
            <TextField
              fullWidth label="Số lượng" type="number" margin="dense"
              name="quantity" // Add name prop
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
              inputProps={{ min: "0" }}
            />

            <TextField
              select
              fullWidth
              label="Danh mục"
              margin="dense"
              name="category_id" // Add name prop
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
              name="brand_id" // Add name prop
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
                        position: 'absolute', top: 2, right: 2, fontSize: 10, minWidth: 'unset', px: 1, py: '2px'
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận Xóa */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa sản phẩm?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm này? Thao tác này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Xóa
          </Button>
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