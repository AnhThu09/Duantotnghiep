// BrandManager.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface Brand {
  brand_id: number;
  brand_name: string;
  logo: string;
  description: string;
}

export default function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState({ brand_name: '', description: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const API_BASE_URL = 'http://localhost:3000/api/brands';

  const fetchBrands = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      showSnackbar(`Lỗi khi tải thương hiệu: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_BASE_URL}/update/${editingId}` : `${API_BASE_URL}/add`;

      const form = new FormData();
      form.append('brand_name', formData.brand_name);
      form.append('description', formData.description);
      if (logoFile) form.append('logo', logoFile);

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      showSnackbar(`Thương hiệu đã được ${editingId ? 'cập nhật' : 'thêm mới'} thành công!`, 'success');
      setFormData({ brand_name: '', description: '' });
      setLogoFile(null);
      setLogoPreview('');
      setEditingId(null);
      fetchBrands();
    } catch (error) {
      showSnackbar(`Lỗi khi gửi dữ liệu: ${error}`, 'error');
    }
  };

  const handleEdit = (brand: Brand) => {
    setFormData({ brand_name: brand.brand_name, description: brand.description });
    setLogoPreview(brand.logo);
    setEditingId(brand.brand_id);
  };

  const handleDeleteConfirm = (id: number) => {
    setDeletingId(id);
    setOpenConfirmDialog(true);
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${deletingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      showSnackbar('Thương hiệu đã được xóa thành công!', 'success');
      setOpenConfirmDialog(false);
      setDeletingId(null);
      fetchBrands();
    } catch (error) {
      showSnackbar(`Lỗi khi xóa thương hiệu: ${error}`, 'error');
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setDeletingId(null);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý Thương hiệu</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>{editingId ? 'Chỉnh sửa' : 'Thêm Thương hiệu'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Tên Thương hiệu" name="brand_name" value={formData.brand_name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Mô tả" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
          <Typography variant="subtitle1" gutterBottom>Logo Thương hiệu</Typography>
          {logoPreview && (
            <Box mt={2}><img src={logoPreview} alt="Preview" style={{ width: 120 }} /></Box>
          )}

          <Button variant="contained" component="label">
            Chọn ảnh
            <input hidden accept="image/*" type="file" onChange={handleLogoUpload} />
          </Button> <br />
          <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2 }}>{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
          {editingId && (
            <Button variant="outlined" onClick={() => {
              setEditingId(null);
              setFormData({ brand_name: '', description: '' });
              setLogoFile(null);
              setLogoPreview('');
            }} sx={{ mt: 2 }}>Hủy</Button>
          )}
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Danh sách Thương hiệu</Typography>
        {brands.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Logo</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.brand_id}>
                    <TableCell>{brand.brand_id}</TableCell>
                    <TableCell>{brand.brand_name}</TableCell>
                    <TableCell><img src={`http://localhost:3000/uploads/${brand.logo}`} alt="logo" style={{ width: 60 }} /></TableCell>
                    <TableCell>{brand.description}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(brand)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDeleteConfirm(brand.brand_id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>Chưa có thương hiệu nào.</Typography>
        )}
      </Paper>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent><DialogContentText>Bạn chắc chắn muốn xóa?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Hủy</Button>
          <Button onClick={handleDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}
