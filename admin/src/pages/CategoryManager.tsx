import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert, { type AlertProps } from '@mui/material/Alert'; // Giữ nguyên MuiAlert từ đường dẫn này


// Hàm Alert để dùng với Snackbar - Giữ nguyên
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Định nghĩa interface cho Category - Giữ nguyên
interface Category {
  category_id: number;
  category_name: string;
  slug: string;
  description: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({ category_name: '', slug: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  // States mới cho Dialog xác nhận xóa
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // States mới cho Snackbar thông báo
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // URL API của bạn - Đã cập nhật theo yêu cầu của bạn
  const API_BASE_URL = 'http://localhost:3000/api/categories'; 

  // Hàm để tải danh sách danh mục từ API - Giữ nguyên logic
  const fetchCategories = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      showSnackbar(`Lỗi khi tải danh mục: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý thay đổi dữ liệu trong input/textarea của form - Giữ nguyên logic
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi form (thêm mới hoặc cập nhật danh mục) - Giữ nguyên logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE_URL}/update/${editingId}` : `${API_BASE_URL}/add`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      showSnackbar(`Danh mục đã được ${editingId ? 'cập nhật' : 'thêm mới'} thành công!`, 'success');
      setFormData({ category_name: '', slug: '', description: '' });
      setEditingId(null);
      fetchCategories(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      showSnackbar(`Lỗi khi ${editingId ? 'cập nhật' : 'thêm'} danh mục: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  // Xử lý khi người dùng nhấn nút "Sửa" - Giữ nguyên logic
  const handleEdit = (category: Category) => {
    setFormData({
      category_name: category.category_name,
      slug: category.slug,
      description: category.description,
    });
    setEditingId(category.category_id);
  };

  // Mở Dialog xác nhận xóa - Thay thế confirm() mặc định
  const handleDeleteConfirm = (id: number) => {
    setDeletingId(id);
    setOpenConfirmDialog(true);
  };

  // Xử lý khi người dùng nhấn nút "Xoá" trong Dialog - Giữ nguyên logic
  const handleDelete = async () => {
    if (deletingId === null) return;

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${deletingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      showSnackbar('Danh mục đã được xóa thành công!', 'success');
      setOpenConfirmDialog(false); // Đóng dialog
      setDeletingId(null); // Reset ID đang xóa
      fetchCategories(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xoá:", error);
      showSnackbar(`Lỗi khi xóa danh mục: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  // Đóng Dialog xác nhận xóa
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setDeletingId(null);
  };

  // Hiển thị Snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Đóng Snackbar
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}> {/* Thay div bằng Box, thêm margin-top */}
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý Danh mục
      </Typography>

      {/* Form thêm/sửa danh mục - Thay div bằng Paper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục Mới'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên Danh mục"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined" // Mặc định là outlined cho đẹp
          />
          <TextField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline // Cho phép nhiều dòng
            rows={3} // Số dòng mặc định
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained" // Button có nền màu
            color="primary"
            sx={{ mt: 2, mr: 2 }} // Margin top và margin right
          >
            {editingId ? 'Cập nhật' : 'Thêm Mới'}
          </Button>
          {editingId && (
            <Button
              variant="outlined" // Button không nền màu
              color="secondary"
              onClick={() => {
                setEditingId(null);
                setFormData({ category_name: '', slug: '', description: '' });
              }}
              sx={{ mt: 2 }}
            >
              Hủy
            </Button>
          )}
        </form>
      </Paper>

      {/* Danh sách các danh mục - Thay div bằng Paper và Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Danh sách Danh mục
        </Typography>
        {categories.length > 0 ? (
          <TableContainer> {/* Thêm TableContainer để có thanh cuộn nếu bảng quá lớn */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên Danh mục</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="right">Hành động</TableCell> {/* Căn phải cho cột hành động */}
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.category_id}>
                    <TableCell>{cat.category_id}</TableCell>
                    <TableCell>{cat.category_name}</TableCell>
                    <TableCell>{cat.slug}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(cat)}>
                        <EditIcon /> {/* Icon Sửa */}
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteConfirm(cat.category_id)}>
                        <DeleteIcon /> {/* Icon Xóa */}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Chưa có danh mục nào được thêm.
          </Typography>
        )}
      </Paper>

      {/* Confirm Delete Dialog - Thêm Dialog xác nhận xóa */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
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

      {/* Snackbar for notifications - Thêm Snackbar thông báo */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}