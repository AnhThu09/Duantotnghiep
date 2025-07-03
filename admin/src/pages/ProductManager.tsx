import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, Grid, Rating,
  TextField, InputAdornment, MenuItem, Snackbar, Alert, CircularProgress, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';

// --- INTERFACES ---
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
    name: '', description: '', price: '', quantity: '', thumbnail: null as File | null,
    previewUrl: '', category_id: '', brand_id: ''
  });
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });

  // --- API CALLS ---
  // Hàm fetchProducts: Tải sản phẩm từ API (hiện tại là toàn bộ sản phẩm)
  const fetchProducts = useCallback(async () => { // Đã loại bỏ searchQuery từ params, sẽ lọc client-side
    setLoading(true);
    setError(null);
    try {
      // Gọi API để lấy TẤT CẢ sản phẩm.
      // Nếu bạn muốn tìm kiếm và phân trang ở backend, bạn cần thêm các params search, limit, offset vào đây.
      const res = await axios.get(`${BASE_URL}/products`);
      
      // Sắp xếp ID giảm dần (ví dụ: 16, 15, 14, ...)
      const sortedProducts = [...res.data].sort((b, a) => b.product_id - a.product_id);
      
      setProducts(sortedProducts); // Cập nhật state với danh sách đã sắp xếp
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      setProducts([]); // Xóa dữ liệu cũ nếu có lỗi
    } finally {
      setLoading(false);
    }
  }, []); // `fetchProducts` không có dependencies thay đổi, sẽ chỉ fetch một lần (hoặc khi gọi lại thủ công)

  // useEffect để tải sản phẩm ban đầu
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // useEffect để tải danh mục và thương hiệu (chỉ chạy một lần khi component mount)
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
      name: '', description: '', price: '', quantity: '', thumbnail: null,
      previewUrl: '', category_id: '', brand_id: ''
    });
    setOpenDialog(true);
  }, []);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
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
      fetchProducts(); // Tải lại danh sách sau khi xóa
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
    setPage(0); // Reset về trang đầu tiên khi thay đổi số hàng mỗi trang
  }, []);

  // Search Handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset page to 0 on new search
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

    if (!formData.name || !formData.description || isNaN(priceNum) || isNaN(quantityNum) || isNaN(categoryId) || isNaN(brandId) || priceNum < 0 || quantityNum < 0) {
      setAlert({ open: true, message: '❌ Vui lòng điền đầy đủ thông tin hợp lệ (giá, số lượng phải là số không âm).', severity: 'warning' });
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
        setPage(0); // Quay về trang đầu tiên khi thêm sản phẩm mới
      }
      fetchProducts(); // Tải lại danh sách sau khi lưu
      handleCloseDialog();
    } catch (err: any) {
      console.error('Save error:', err.response?.data || err.message);
      setAlert({ open: true, message: `❌ Lỗi khi lưu sản phẩm: ${err.response?.data?.message || err.message}`, severity: 'error' });
    }
  }, [editingProduct, formData, fetchProducts, handleCloseDialog]);

  // Memoized data for table display (Client-side filtering and pagination)
  const filteredAndPaginatedProducts = useMemo(() => {
    let currentProducts = products;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter((product) =>
        String(product.product_id).includes(lowerCaseSearchTerm) || // Search by ID
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        String(product.price).includes(lowerCaseSearchTerm) || // Search by price (as string)
        String(product.quantity).includes(lowerCaseSearchTerm) || // Search by quantity (as string)
        // If you want to search by category/brand name, you'd need to find the name first
        categories.find(c => c.category_id === product.category_id)?.category_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        brands.find(b => b.brand_id === product.brand_id)?.brand_name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Client-side pagination
    const startIndex = page * rowsPerPage;
    return currentProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [products, searchTerm, page, rowsPerPage, categories, brands]); // Dependencies for re-calculation

  // Total count for TablePagination (after client-side filtering)
  const totalFilteredProductCount = useMemo(() => {
    let currentProducts = products;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter((product) =>
        String(product.product_id).includes(lowerCaseSearchTerm) ||
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        String(product.price).includes(lowerCaseSearchTerm) ||
        String(product.quantity).includes(lowerCaseSearchTerm) ||
        categories.find(c => c.category_id === product.category_id)?.category_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        brands.find(b => b.brand_id === product.brand_id)?.brand_name.toLowerCase().includes(lowerCaseSearchTerm)
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Quản lý Sản phẩm
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
                  {searchTerm && ( // Clear button only when there's text
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
                <TableCell>Mô tả</TableCell>
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
                  <TableCell colSpan={9} align="center">
                    Không tìm thấy sản phẩm nào.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndPaginatedProducts.map((p) => (
                  <TableRow key={p.product_id}>
                    <TableCell>{p.product_id}</TableCell>
                    <TableCell>{p.name}</TableCell>
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
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
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
              fullWidth label="Mô tả" margin="dense" multiline rows={3}
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
        <DialogActions >
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